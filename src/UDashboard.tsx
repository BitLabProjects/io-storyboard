import * as React from 'react';

import { Button, Paper, TextField, Typography } from '@material-ui/core';
import { ImportExportOutlined } from '@material-ui/icons';

import CStoryboard from './CStoryboard';
import UOutput from './UOutput';
import { BitLabHost, INetworkState } from './BitLabHost';


interface IDashboardProps {
  storyboard: CStoryboard;
}
interface IDashboardState {
  textToSend: string;
  receivedText: string;
  networkState: INetworkState | null;
}

class UDashboard extends React.Component<IDashboardProps, IDashboardState> {
  private mHost: BitLabHost;
  constructor(props: IDashboardProps) {
    super(props);

    this.state = {
      textToSend: "",
      receivedText: "",
      networkState: null
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
        <Paper style={{
          display: "flex", flexDirection: "column",
          margin: "5px", padding: "5px"
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
          display: "flex", flexDirection: "column",
          margin: "5px", padding: "5px"
        }} >
          <Typography style={{ margin: "20px 0px" }} variant="h5" >Commands</Typography>
          <Button onClick={this.getState}>State</Button>
          <TextField variant={"outlined"} label="Text to send" multiline
            value={(this.state.networkState && this.state.networkState.NetState) || "unknown"} />
        </Paper>

        <Paper style={{
          display: "flex", flexDirection: "column",
          margin: "5px", padding: "5px"
        }} >
          <Typography style={{ margin: "20px 0px" }} variant="h5" >Output</Typography>
          <div style={{
            margin: "5px", height: "400px",
            display: "flex", flexDirection: "row", overflowX: "auto", overflowY: "hidden"
          }} >
            {this.props.storyboard.Timelines.map((timeline) => (
              <UOutput timeline={timeline} onChange={this.sendDataToSocket} />
            ))}
          </div>
        </Paper>
      </div>
    );
  }

  private onInterval = () => {
    // const txt = `Packets: ${this.mHost.PacketsReceived}, Devices: ${JSON.stringify(this.mHost.EnumeratedDevicesAddresses)}`;
    // this.setState({receivedText: txt});
  }

  private onTextToSendChanged = (event: any) => {
    this.setState({ textToSend: event.target.value });
  }

  private sendDataFromTerminal = async () => {
    // send text to COM port   
    // this.sendDataToSocket(this.state.textToSend);
    await this.mHost.toggleLed();
  }
  private getState = async () => {
    // send text to COM port   
    // this.sendDataToSocket(this.state.textToSend);
    this.setState({
      networkState: await this.mHost.getState()
    })

  }



  private sendDataToSocket = (data: any) => {
    // console.log(`Sent: ${data}`);
    // this.mSocket.emit('toCOM', data + "\n");
  }


}

export default UDashboard;