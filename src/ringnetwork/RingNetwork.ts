import { PacketUtils, RingNetworkProtocol, RingPacket } from "./RingPacket";

enum MacState {
  AddressNotAssigned,
  AddressClaiming,
  Idle
};

enum PTxAction {
  PassAlongDecreasingTTL,
  SendFreePacket,
  Send
};

export class RingNetwork {
  private macState: MacState;
  private macAddress: number;
  private macDeviceName: string;

  constructor(private hardwareID: number) {
    this.macState = MacState.AddressNotAssigned;
  }

  public handlePacket(p: RingPacket) {
    const protocolMsgID = p.header.dataSize > 0 ? p.data[0] : RingNetworkProtocol.protocolMsgIDFree;
    let pTxAction = PTxAction.SendFreePacket;

    switch (this.macState) {
      case MacState.AddressNotAssigned:
        if (p.isFreePacket()) {
          // tslint:disable-next-line
          this.macAddress = this.hardwareID & 255;
          this.macDeviceName = "Device-" + String(this.macAddress);
          p.header.control = 0;
          p.header.dataSize = 1 + RingNetworkProtocol.deviceNameMaxSize;
          p.header.dstAddress = this.macAddress;
          p.header.srcAddress = this.macAddress;
          p.header.ttl = RingNetworkProtocol.ttlMax;
          p.data[0] = RingNetworkProtocol.protocolMsgIDAddressClaim;
          for (let i = 0; i < RingNetworkProtocol.deviceNameMaxSize; i++) {
            if (i < this.macDeviceName.length) {
              // tslint:disable-next-line
              p.data[1 + i] = this.macDeviceName.charCodeAt(i) & 255;
            } else {
              p.data[1 + i] = 0;
            }
          }
          console.log("Sent address claim packet");
          pTxAction = PTxAction.Send;
          this.macState = MacState.AddressClaiming;
        }
        else {
          console.log("Pass");
          pTxAction = PTxAction.PassAlongDecreasingTTL;
        }
        break;

      case MacState.AddressClaiming:
        if (p.isProtocolPacket()) {
          switch (protocolMsgID) {
            case RingNetworkProtocol.protocolMsgIDAddressClaim:
              const readAddress = PacketUtils.getString(p.data, 1, RingNetworkProtocol.deviceNameMaxSize);
              console.log(`Address claim received, addr:${p.header.dstAddress}, name:${readAddress}`);
              // We are claiming an address and received an addressclaim packet, there are three cases
              if (p.isForDstAddress(this.macAddress)) {
                const nameCmpResult = this.macDeviceName < readAddress ? -1 : this.macDeviceName === readAddress ? 0 : 1;
                if (nameCmpResult === 0) {
                  // case 1: It's our packet that round-tripped the ring, the address is claimed
                  console.log("Address claimed");
                  pTxAction = PTxAction.SendFreePacket;
                  this.macState = MacState.Idle;
                }
                else {
                  // case 2: It's another device claiming the same address, the one with the 'lower' name wins
                  if (nameCmpResult < 0) {
                    console.log("Discarded conflicting claim");
                    // We have a lower name, discard the other device packet name and keep waiting
                    pTxAction = PTxAction.SendFreePacket;
                  }
                  else {
                    console.log("Conflicting claim, going back to initial state");
                    // The other device has a lower name, go back to initial state
                    pTxAction = PTxAction.PassAlongDecreasingTTL;
                    this.macState = MacState.AddressNotAssigned;
                  }
                }
              }
              else {
                // case 3: It's another device claiming another address, pass the message along
                console.log("Address claim of another device");
                pTxAction = PTxAction.PassAlongDecreasingTTL;
              }
              break;

            default:
              // Unknown protocol msgid, TODO signal
              // Pass along, even if the dst address is the one we're trying to claim.
              pTxAction = PTxAction.PassAlongDecreasingTTL;
              console.log("Pass");
              break;
          }
        }
        else {
          // It's a data packet, we don't have an address yet so we can only pass along
          // Note that if the address we are trying to claim is of someone else, we don't want to disturb his traffic here
          console.log("Pass");
          pTxAction = PTxAction.PassAlongDecreasingTTL;
        }
        break;
        
      case MacState.Idle:

        break;
    }

    switch (pTxAction) {
      case PTxAction.PassAlongDecreasingTTL:
        p.header.ttl -= 1;
        // If the ttl reaches zero, transform the packet to a free packet:
        // This is the place where we prevent infinite packet looping
        // Es: a packet destinated to a non-existing dst_address
        if (p.header.ttl === 0) {
          p.setFreePacket();
        }
        break;

      case PTxAction.SendFreePacket:
        p.setFreePacket();
        break;

      case PTxAction.Send:
        break;
    }
  }
}