import { RingNetworkProtocol, RingPacket } from "./RingPacket";

enum RxState {
  RxIdle,
  ReceivePacketHeader_DataSize,
  ReceivePacketHeader_Control,
  ReceivePacketHeader_SrcAddress,
  ReceivePacketHeader_DstAddress,
  ReceivePacketHeader_TTL,
  ReceivePacketData,
  ReceivePacketFooter_Hash0,
  ReceivePacketFooter_Hash1,
  ReceivePacketFooter_Hash2,
  ReceivePacketFooter_Hash3,
  RxEscape,
  ReceiveEndByte
};

export class RingPacketParser {
  private rxState: RxState;
  private rxStateReturn: RxState;
  private rxDataReadIdx: number;
  private rxPacket: RingPacket;

  constructor(private onPacketReady: (packet: RingPacket) => void) {
    this.rxState = RxState.RxIdle;
    this.rxStateReturn = RxState.RxIdle;
    this.rxDataReadIdx = 0;
    this.rxPacket = new RingPacket();
  }

  public inputBytes(bytes: Uint8Array) {
    for (let i = 0; i < bytes.byteLength; i++) {
      const value = bytes[i];

      if (this.rxState === RxState.RxEscape) {
        this.rxState = this.rxStateReturn;
      } else if (value === RingNetworkProtocol.EscapeByte) {
        this.rxStateReturn = this.rxState;
        this.rxState = RxState.RxEscape;
        // Discard the escape char
      } else {
        switch (this.rxState) {
          case RxState.RxIdle:
            if (value === RingNetworkProtocol.StartByte) {
              this.rxState = RxState.ReceivePacketHeader_DataSize;
            }
            break;

          case RxState.ReceivePacketHeader_DataSize:
            this.rxPacket.header.dataSize = value;
            this.rxState = RxState.ReceivePacketHeader_Control;
            break;

          case RxState.ReceivePacketHeader_Control:
            this.rxPacket.header.control = value;
            this.rxState = RxState.ReceivePacketHeader_SrcAddress;
            break;

          case RxState.ReceivePacketHeader_SrcAddress:
            this.rxPacket.header.srcAddress = value;
            this.rxState = RxState.ReceivePacketHeader_DstAddress;
            break;

          case RxState.ReceivePacketHeader_DstAddress:
            this.rxPacket.header.dstAddress = value;
            this.rxState = RxState.ReceivePacketHeader_TTL;
            break;

          case RxState.ReceivePacketHeader_TTL:
            this.rxPacket.header.ttl = value;

            this.rxPacket.data = [];
            if (this.rxPacket.header.dataSize === 0) {
              this.rxState = RxState.ReceivePacketFooter_Hash0;
            } else {
              this.rxState = RxState.ReceivePacketData;
              this.rxDataReadIdx = 0;
              this.rxPacket.data.length = this.rxPacket.header.dataSize;
            }
            break;

          case RxState.ReceivePacketData:
            this.rxPacket.data[this.rxDataReadIdx] = value;
            this.rxDataReadIdx += 1;
            if (this.rxDataReadIdx === this.rxPacket.header.dataSize) {
              this.rxState = RxState.ReceivePacketFooter_Hash0;
            }
            break;

          case RxState.ReceivePacketFooter_Hash0:
            this.rxPacket.footer.hash[0] = value;
            this.rxState = RxState.ReceivePacketFooter_Hash1;
            break;
          case RxState.ReceivePacketFooter_Hash1:
            this.rxPacket.footer.hash[1] = value;
            this.rxState = RxState.ReceivePacketFooter_Hash2;
            break;
          case RxState.ReceivePacketFooter_Hash2:
            this.rxPacket.footer.hash[2] = value;
            this.rxState = RxState.ReceivePacketFooter_Hash3;
            break;
          case RxState.ReceivePacketFooter_Hash3:
            this.rxPacket.footer.hash[3] = value;
            this.rxState = RxState.ReceiveEndByte;
            break;

          case RxState.ReceiveEndByte:
            if (value !== RingNetworkProtocol.EndByte) {
              // TODO mark malformed packet
            }
            this.onPacketReady(this.rxPacket);
            this.rxPacket = new RingPacket();
            this.rxState = RxState.RxIdle;
            break;
        }
      }
    }
  }
}