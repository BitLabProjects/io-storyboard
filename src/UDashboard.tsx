import * as React from 'react';

import { Button, List, Paper, TextField, Typography } from '@material-ui/core';
import { ImportExportOutlined } from '@material-ui/icons';

import * as SocketIOClient from 'socket.io-client';
import CStoryboard from './CStoryboard';
import UOutput from './UOutput';

import { RingNetwork } from './ringnetwork/RingNetwork';
import { RingPacket } from './ringnetwork/RingPacket';
import { RingPacketParser } from './ringnetwork/RingPacketParser';

class UDashboardProps {
  public storyboard: CStoryboard;
}
class UDashboardState {
  public textToSend: string;
  public receivedText: string;
}

class UDashboard extends React.Component<UDashboardProps, UDashboardState> {

  private mSocket: SocketIOClient.Socket;
  private mRingPacketParser: RingPacketParser;
  private mRingNetwork: RingNetwork;

  constructor(props: UDashboardProps) {
    super(props);

    this.state = {
      textToSend: "",
      receivedText: ""
    };

    this.mRingNetwork = new RingNetwork(123456789);
    this.mRingPacketParser = new RingPacketParser((packet: RingPacket) => {
      console.log("Received packet");

      this.mRingNetwork.handlePacket(packet);

      // TODO Update packet hash;
      const packetAsUint8Array = packet.toUint8Array();
      this.mSocket.emit('toCOM', packetAsUint8Array.buffer.slice(packetAsUint8Array.byteOffset, packetAsUint8Array.byteLength));
    });

    this.mSocket = SocketIOClient("http://localhost:3030");
    this.mSocket.on("fromCOM", (data: ArrayBuffer) => {
      this.mRingPacketParser.inputBytes(new Uint8Array(data));

      const receivedBytes = Number(this.state.receivedText) + data.byteLength;
      this.setState({ receivedText: String(receivedBytes) });
    })
  }

  public render() {

    return (
      <div style={{        
        marginLeft: "5px", marginRight: "5px",
        display: "flex", flexDirection: "column"
      }}>
        <Typography style={{ margin: "40px 0" }} variant="h6" >Dashboard mode</Typography>
        <Paper style={{
          display: "flex", flexDirection: "column", margin: "5px",
          paddingLeft: "5px", paddingRight: "5px"
        }} >
          <Typography style={{ margin: "20px 0px" }} variant="h5" >Command line</Typography>
          <TextField variant={"outlined"} label="Text to send" multiline
            onChange={this.onTextToSendChanged} value={this.state.textToSend} />
          <Button style={{ margin: "10px" }} variant="fab" onClick={this.sendDataFromTerminal}>
            <ImportExportOutlined />
          </Button>
          <TextField variant={"outlined"} label="Text received" multiline value={this.state.receivedText} />
        </Paper>
        <Paper style={{
          display: "flex", flexDirection: "column", margin: "5px",
          paddingLeft: "5px", paddingRight: "5px"
        }} >
          <Typography style={{ margin: "20px 0px" }} variant="h5" >Output</Typography>
          <List>
            {this.props.storyboard.Timelines.map((timeline) => (
              <UOutput timeline={timeline} onChange={this.sendDataToSocket} />
            ))}
          </List>
        </Paper>
      </div>
    );
  }

  private onTextToSendChanged = (event: any) => {
    this.setState({ textToSend: event.target.value });
  }

  private sendDataFromTerminal = () => {
    // send text to COM port   
    this.sendDataToSocket(this.state.textToSend);
  }

  private sendDataToSocket = (data: any) => {
    console.log(`Sent: ${data}`);
    this.mSocket.emit('toCOM', data + "\n");
  }


}

export default UDashboard;