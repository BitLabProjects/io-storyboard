import * as SocketIOClient from 'socket.io-client';
import { Timer } from './Utils/Timer';

export interface IDevice {
  address: number;
  hwId: string;
  crc: string;
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
    // this.mSerialInterface = new SerialInterface("http://192.168.43.217:3030");
    this.mSerialInterface = new SerialInterface("http://localhost:3030");
  }

  public get LastResponse(): string {
    return this.mSerialInterface.LastResponse.join("\n");
  }

  public async sendText(commandText: string) {
    await this.mSerialInterface.sendAndGetResponse(commandText + "\n");
  }

  public async toggleLed() {
    return this.mSerialInterface.sendAndGetResponse("toggleLed\n");
  }
  public async getState(): Promise<INetworkState> {
    return new Promise<INetworkState>(async (resolve, reject) => {
      const stateStr = await this.mSerialInterface.sendAndGetResponse("state\n");
      if (stateStr.length !== 5) {
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
      if (upTime != null && freePackets != null && netState != null && devicesArray != null) {
        match = expr.exec(devicesArray);
        while (match) {
          devices.push({
            address: parseInt(match[1].trim(), 10),
            hwId: match[2].trim(),
            crc: match[3].trim()
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

  public async setOutput(hwId: string, outputId: number, value: number): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponseDelayed(
      `setOutput ${hwId} ${outputId} ${value}\n`
    );
  }

  public async openFile(filePath: string, mode: "r" | "w" | "a" | "r+" | "w+" | "a+") {
    return await this.mSerialInterface.sendAndGetResponse(`openFile ${filePath} ${mode}\n`);
  }
  public async closeFile(): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponse(`closeFile\n`);
  }
  public async writeFile(contentAsBase64: string): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponse(`writeFile ${contentAsBase64}\n`);
  }

  public async loadStoryboard(fileName: string): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponse(`load ${fileName}\n`);
  }
  public async uploadStoryboard(): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponseDelayed(`upload\n`);
  }
  public async checkStoryboards(): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponseDelayed(`check\n`);
  }
  public async playStoryboard(): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponseDelayed(`play\n`);
  }
  public async pauseStoryboard(): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponseDelayed(`pause\n`);
  }
  public async stopStoryboard(): Promise<string[]> {
    return await this.mSerialInterface.sendAndGetResponseDelayed(`stop\n`);
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
        lines.push(line);
        if (line === "Ok" || line === "Error") {
          this.mCurrentPromise = null;
          this.LastResponse = lines;
          resolve(lines);
        }
      }
      this.mSocket.emit('toCOM', uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteLength));
    });
  }

  public async sendAndGetResponseDelayed(cmd: string): Promise<string[]> {
    const result = await this.sendAndGetResponse(cmd);
    // Delay because the master board returns ok before it has completed the command
    await Timer.delay(1000);
    return result;
  }
}