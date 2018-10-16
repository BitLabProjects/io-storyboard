import * as React from 'react';

import { Button, List, Paper, TextField, Typography } from '@material-ui/core';
import { ImportExportOutlined } from '@material-ui/icons';

import CStoryboard from './CStoryboard';
import UOutput from './UOutput';
import { BitLabHost } from './BitLabHost';

class UDashboardProps {
  public storyboard: CStoryboard;
}
class UDashboardState {
  public textToSend: string;
  public receivedText: string;
}

class UDashboard extends React.Component<UDashboardProps, UDashboardState> {
  private mHost: BitLabHost;
  constructor(props: UDashboardProps) {
    super(props);

    this.state = {
      textToSend: "",
      receivedText: ""
    };

    this.mHost = new BitLabHost();

    setInterval(this.onInterval, 1000);

    setTimeout(() => {
      this.mHost.enumerateDevices();
    }, 3000);
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

  private onInterval = () => {
    const txt = `Packets: ${this.mHost.PacketsReceived}, Devices: ${JSON.stringify(this.mHost.EnumeratedDevicesAddresses)}`;
    this.setState({receivedText: txt});
  }

  private onTextToSendChanged = (event: any) => {
    this.setState({ textToSend: event.target.value });
  }

  private sendDataFromTerminal = () => {
    // send text to COM port   
    this.sendDataToSocket(this.state.textToSend);
  }

  private sendDataToSocket = (data: any) => {
    // console.log(`Sent: ${data}`);
    // this.mSocket.emit('toCOM', data + "\n");
  }


}

export default UDashboard;