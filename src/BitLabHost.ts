import * as SocketIOClient from 'socket.io-client';

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
      this.mSocket.emit('toCOM', uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteLength));

      const lines: string[] = [];
      this.mCurrentPromise = (line: string) => {
        if (line === "") {
          this.mCurrentPromise = null;
          resolve(lines);
        } else {
          lines.push(line);
        }
      }
    });
  }
}