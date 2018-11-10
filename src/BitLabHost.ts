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
  private mEnumeratedDevicesAddresses: number[];
  // private mLastLedState: number;

  constructor() {
    this.mEnumeratedDevicesAddresses = [];
    // this.mLastLedState = 0;

    this.mSerialInterface = new SerialInterface("http://localhost:3030");
  }

  get EnumeratedDevicesAddresses() { return this.mEnumeratedDevicesAddresses; }

  public async enumerateDevices() {
    // TODO
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
      let upTime: number = -1;
      let match = (new RegExp("Up time\: (.*) sec")).exec(stateStr[0]);
      if (match) {
        upTime = parseInt(match[1], 10);
      }
      let freePackets: number = -1;
      match = (new RegExp("Free packets\: (.*)")).exec(stateStr[1]);
      if (match) {
        freePackets = parseInt(match[1], 10);
      }
      let netState: string = "undefined";
      match = (new RegExp("Net state\: (.*)")).exec(stateStr[2]);
      if (match) {
        netState = match[1];
      }
      const devices: IDevice[] = [];
      match = (new RegExp("Enumerated devices\: (.*)")).exec(stateStr[3]);
      const devicesArray = match && match[1];
      if (devicesArray) {
        const devicesStr = devicesArray.replace("[", "").replace("]", "");
        const devicesSplitted = devicesStr.split(",");
        if (devicesSplitted) {
          for (const device of devicesSplitted) {
            const entries = device.split(";");
            if (entries) {
              const addr = entries[0].split(":");
              const hwId = entries[1].split(":");
              const crc = entries[2].split(":");
              if (addr && hwId && crc) {
                devices.push({
                  address: parseInt(addr[1].trim(), 10),
                  hwId: parseInt(hwId[1].trim(), 16),
                  crc: parseInt(crc[1].trim(), 16)
                })
              }
            }
          }
        }
      }
      resolve(
        {
          EnumeratedDevice: devices,
          FreePackets: freePackets,
          NetState: netState,
          UpTime: upTime
        }
      );
      return;
    });

  }
}

class SerialInterface {
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
          resolve(lines);
        } else {
          lines.push(line);
        }
      }
      this.mSocket.emit('toCOM', uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteLength));
    });
  }
}