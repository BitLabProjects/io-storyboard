import * as SocketIOClient from 'socket.io-client';
import { RingPacket, RingNetworkProtocol } from './ringnetwork/RingPacket';
import { RingPacketParser } from './ringnetwork/RingPacketParser';
import { RingNetwork, PTxAction } from './ringnetwork/RingNetwork';

type IPendingPromise = (p: RingPacket, arg: { pTxAction: PTxAction }) => void;

export class BitLabHost {
  private mSocket: SocketIOClient.Socket;
  private mRingPacketParser: RingPacketParser;
  private mRingNetwork: RingNetwork;
  private mPacketsReceived: number;
  private mEnumeratedDevicesAddresses: number[];
  private mPendingPromise: IPendingPromise | null;
  private mLastLedState: number;

  constructor() {
    this.mPacketsReceived = 0;
    this.mEnumeratedDevicesAddresses = [];
    this.mPendingPromise = null;
    this.mLastLedState = 0;

    this.mRingNetwork = new RingNetwork(123456789, this.onPacketReceived);
    this.mRingPacketParser = new RingPacketParser((packet: RingPacket) => {
      this.mPacketsReceived += 1;

      this.mRingNetwork.handlePacket(packet);

      // TODO Update packet hash;
      const packetAsUint8Array = packet.toUint8Array();
      this.mSocket.emit('toCOM', packetAsUint8Array.buffer.slice(packetAsUint8Array.byteOffset, packetAsUint8Array.byteLength));
    });

    this.mSocket = SocketIOClient("http://localhost:3030");
    this.mSocket.on("fromCOM", (data: ArrayBuffer) => {
      this.mRingPacketParser.inputBytes(new Uint8Array(data));
    })
  }

  get PacketsReceived() { return this.mPacketsReceived; }
  get EnumeratedDevicesAddresses() { return this.mEnumeratedDevicesAddresses; }

  public async enumerateDevices() {
    console.log('enumerateDevices start');
    this.mEnumeratedDevicesAddresses = [];
    for (let i = 1; i < 100; i++) {
      // Send multiple WhoAreYou packets with increasing ttl, and collect the resulting Hellos
      const whoAreYou = new RingPacket();
      whoAreYou.header.dataSize = 1;
      whoAreYou.header.control = 0;
      whoAreYou.header.srcAddress = this.mRingNetwork.MacAddress;
      whoAreYou.header.dstAddress = 0;
      whoAreYou.header.ttl = i;
      whoAreYou.data = [RingNetworkProtocol.protocolMsgIDWhoAreYou];
      await this.waitFreeAndSend(whoAreYou);

      const helloPacket = await this.waitHelloOrWhoAreYouPacket();
      if (helloPacket.header.srcAddress === this.mRingNetwork.MacAddress) {
        // It's a Hello packet from me, the scan is completed because i found myself
        break;
      } else {
        this.mEnumeratedDevicesAddresses.push(helloPacket.header.srcAddress);
      }
    }
    console.log(`enumerateDevices finish, ${this.mEnumeratedDevicesAddresses.length} found`);
  }

  public async toggleLed() {
    this.mLastLedState = 1 - this.mLastLedState;
    const p = new RingPacket();
    p.header.dataSize = 2;
    p.header.control = 1;
    p.header.srcAddress = this.mRingNetwork.MacAddress;
    p.header.dstAddress = this.mEnumeratedDevicesAddresses[0];
    p.header.ttl = RingNetworkProtocol.ttlMax;
    p.data = [1, this.mLastLedState];
    await this.waitFreeAndSend(p);
  }

  // private async waitFreePacket(): Promise<PacketAndPTxAction> {
  //   return this. waitPacket((p) => p.isFreePacket());
  // }
  private async waitHelloOrWhoAreYouPacket(): Promise<RingPacket> {
    return this.waitPacket((p) => {
      const isHello =
        p.isProtocolPacket() &&
        p.isForDstAddress(this.mRingNetwork.MacAddress) &&
        p.header.dataSize > 0 &&
        p.data[0] === RingNetworkProtocol.protocolMsgIDHello;
      // const isWhoAreYouFromMe =
      //   p.isProtocolPacket() &&
      //   p.header.srcAddress === this.mRingNetwork.MacAddress &&
      //   p.header.dataSize > 0 &&
      //   p.data[0] === RingNetworkProtocol.protocolMsgIDWhoAreYou;
      return isHello;
    }
    );
  }

  private async waitPacket(predicate: (p: RingPacket) => boolean): Promise<RingPacket> {
    return new Promise<any>((resolve, reject) => {
      this.mPendingPromise = (p: RingPacket, arg: { pTxAction: PTxAction }) => {
        if (predicate(p)) {
          this.mPendingPromise = null;
          const pCopy = new RingPacket();
          pCopy.copyFrom(p)
          resolve(pCopy);
        } else {
          // Keep waiting
        }
      }
    });
  }

  private async waitFreeAndSend(packetToSend: RingPacket) {
    return new Promise<any>((resolve, reject) => {
      this.mPendingPromise = (p: RingPacket, arg: { pTxAction: PTxAction }) => {
        if (p.isFreePacket()) {
          p.copyFrom(packetToSend);
          arg.pTxAction = PTxAction.Send;
          this.mPendingPromise = null;
          resolve();
        } else {
          // Keep waiting
        }
      }
    });
  }

  // private async yield() {
  //   return new Promise<any>((resolve, reject) => {
  //     setTimeout(() => {resolve()}, 1);
  //   });
  // }

  private onPacketReceived = (p: RingPacket, arg: { pTxAction: PTxAction }) => {
    if (this.mPendingPromise) {
      this.mPendingPromise(p, arg);
    }
  }
}