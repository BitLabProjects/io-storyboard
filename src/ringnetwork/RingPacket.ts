
export class RingNetworkProtocol {
  public static readonly packetMaxSize = 265;
  public static readonly ttlMax = 10;
  public static readonly deviceNameMaxSize = 16;
  public static readonly protocolMsgIDFree = 0;
  public static readonly protocolMsgIDAddressClaim = 1;
  public static readonly protocolMsgIDWhoAreYou = 2;
  public static readonly protocolMsgIDHello = 3;

  public static readonly StartByte = 85;
  public static readonly EndByte = 170;
  public static readonly EscapeByte = 27;
};

export class RingPacketHeader {
  public dataSize: number;
  public control: number;
  public srcAddress: number;
  public dstAddress: number;
  public ttl: number;
}

export class RingPacketFooter {
  public hash: number[];

  constructor() {
    this.hash = [];
    for (let i = 0; i < 4; i++) {
      this.hash[i] = 0;
    }
  }
}

export class RingPacket {
  public header: RingPacketHeader;
  public data: number[];
  public footer: RingPacketFooter;

  constructor() {
    this.header = new RingPacketHeader();
    this.data = [];
    this.footer = new RingPacketFooter();
  }

  public isProtocolPacket(): boolean {
    // tslint:disable-next-line
    return (this.header.control & 1) === 0;
  }
  public isFreePacket(): boolean {
    return this.isProtocolPacket() && this.header.dataSize === 0;
  }
  public isForDstAddress(dstAddress: number): boolean {
    return this.header.dstAddress === dstAddress;
  }

  public setFreePacket() {
    this.header.control = 0;
    this.header.dataSize = 0;
    this.header.srcAddress = 0;
    this.header.dstAddress = 0;
    this.header.ttl = RingNetworkProtocol.ttlMax;
  }

  public setHelloUsingSrcAsDst(newSrcAddress: number) {
    this.header.control = 0;
    this.header.dataSize = 1;
    this.header.dstAddress = this.header.srcAddress;
    this.header.srcAddress = newSrcAddress;
    this.header.ttl = RingNetworkProtocol.ttlMax;
    this.data[0] = RingNetworkProtocol.protocolMsgIDHello;
  }

  public toUint8Array(): Uint8Array {
    const result: number[] = [];
    result.push(RingNetworkProtocol.StartByte);
    PacketUtils.pushEscaped(result, this.header.dataSize);
    PacketUtils.pushEscaped(result, this.header.control);
    PacketUtils.pushEscaped(result, this.header.srcAddress);
    PacketUtils.pushEscaped(result, this.header.dstAddress);
    PacketUtils.pushEscaped(result, this.header.ttl);
    for (let j = 0; j < this.header.dataSize; j++) {
      PacketUtils.pushEscaped(result, this.data[j]);
    }
    PacketUtils.pushEscaped(result, this.footer.hash[0]);
    PacketUtils.pushEscaped(result, this.footer.hash[1]);
    PacketUtils.pushEscaped(result, this.footer.hash[2]);
    PacketUtils.pushEscaped(result, this.footer.hash[3]);
    result.push(RingNetworkProtocol.EndByte);
    return Uint8Array.from(result);
  }

}

export class PacketUtils {
  public static pushEscaped(dst: number[], value: number) {
    if (value === RingNetworkProtocol.StartByte ||
      value === RingNetworkProtocol.EndByte ||
      value === RingNetworkProtocol.EscapeByte) {
      dst.push(RingNetworkProtocol.EscapeByte);
    }
    dst.push(value);
  }

  public static getString(data: number[], offset: number, maxLength: number): string {
    let result = "";
    for (let i = 0; i < maxLength; i++) {
      const v = data[offset + i];
      if (v === 0) {
        break;
      }
      result = result + String.fromCharCode(v);
    }
    return result;
  }
}