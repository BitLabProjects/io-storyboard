import * as SocketIOClient from 'socket.io-client';

export interface IDevice {
  address: number;
  hwId: number;
  crc: number;
}
export interface INetworkState {
  UpTime: number;
  FreePackets: number;
  NetState: string;
  EnumeratedDevice: IDevice[];
}


export class BitLabHost {
  private mSerialInterface: SerialInterface;

  constructor() {
    this.mSerialInterface = new SerialInterface("http://localhost:3030");
  }

  public get LastResponse(): string {
    return this.mSerialInterface.LastResponse.join("\n");
  }

  public async sendText(commandText: string) {
    await this.mSerialInterface.sendAndGetResponse(commandText + "\n");
  }

  public async toggleLed() {
    await this.mSerialInterface.sendAndGetResponse("toggleLed\n");
  }
  public async getState(): Promise<INetworkState> {
    return new Promise<INetworkState>(async (resolve, reject) => {
      const stateStr = await this.mSerialInterface.sendAndGetResponse("state\n");
      if (stateStr.length !== 4) {
        reject();
        return;
      }

      let match = /Up time\: (.*) sec/.exec(stateStr[0]);
      const upTime = match && parseInt(match[1], 10);

      match = /Free packets\: (.*)/.exec(stateStr[1]);
      const freePackets = match && parseInt(match[1], 10);

      match = /Net state\: (.*)/.exec(stateStr[2]);
      const netState = match && match[1];

      match = /Enumerated devices\: (.*)/.exec(stateStr[3]);
      const devicesArray = match && match[1];

      const devices: IDevice[] = [];
      const expr = /addr:([\d]+); hwId:([\dA-F]+); crc:([\dA-F]+)/g;
      if (upTime && freePackets && netState && devicesArray) {
        match = expr.exec(devicesArray);
        while (match) {
          devices.push({
            address: parseInt(match[1].trim(), 10),
            hwId: parseInt(match[2].trim(), 16),
            crc: parseInt(match[3].trim(), 16)
          });
          match = expr.exec(devicesArray);
        }
        resolve({
          EnumeratedDevice: devices,
          FreePackets: freePackets,
          NetState: netState,
          UpTime: upTime
        });
      }
      else {
        reject();
      }
    });
  }

  public async setOutput(hwId: string, outputId: number, value: number) {
    await this.mSerialInterface.sendAndGetResponse(
      `setOutput ${hwId} ${outputId} ${value}\n`
    );
  }

  public async openFile(filePath: string, mode: "r" | "w" | "a" | "r+" | "w+" | "a+") {
    await this.mSerialInterface.sendAndGetResponse(`openFile ${filePath} ${mode}\n`);
  }
  public async closeFile() {
    await this.mSerialInterface.sendAndGetResponse(`closeFile\n`);
  }
  public async writeFile(contentAsBase64: string) {
    await this.mSerialInterface.sendAndGetResponse(`writeFile ${contentAsBase64}\n`);
  }

  public async loadFile(fileName: string) {
    await this.mSerialInterface.sendAndGetResponse(`load ${fileName}\n`);
  }
  public async uploadFile() {
    await this.mSerialInterface.sendAndGetResponse(`upload\n`);
  }
  public async checkFile() {
    await this.mSerialInterface.sendAndGetResponse(`check\n`);
  }
  public async playStoryboard() {
    await this.mSerialInterface.sendAndGetResponse(`play\n`);
  }
  public async pauseStoryboard() {
    await this.mSerialInterface.sendAndGetResponse(`pause\n`);
  }
  public async stopStoryboard() {
    await this.mSerialInterface.sendAndGetResponse(`stop\n`);
  }

}

class SerialInterface {

  public LastResponse: string[] = [];

  private mSocket: SocketIOClient.Socket;
  private mCurrentPromise: null | ((line: string) => void);

  constructor(url: string) {
    this.mCurrentPromise = null;
    this.mSocket = SocketIOClient(url);
    this.mSocket.on("fromCOM", (data: ArrayBuffer) => {
      const enc = new TextDecoder("utf-8");
      const line = enc.decode(new Uint8Array(data));
      console.log(line);
      if (this.mCurrentPromise) {
        this.mCurrentPromise(line);
      }
    })
  }

  public async sendAndGetResponse(cmd: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const enc = new TextEncoder(); // always utf-8
      const uint8array = enc.encode(cmd);
      const lines: string[] = [];
      this.mCurrentPromise = (line: string) => {
        if (line === "Ok" || line === "Error") {
          this.mCurrentPromise = null;
          this.LastResponse = lines.concat(line);
          resolve(lines);
        } else {
          lines.push(line);
        }
      }
      this.mSocket.emit('toCOM', uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteLength));
    });
  }
}