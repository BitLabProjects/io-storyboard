import * as React from 'react';

import { Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { ImportExportOutlined } from '@material-ui/icons';

import CStoryboard from './CStoryboard';
import UOutput from './UOutput';
import { BitLabHost, INetworkState } from './BitLabHost';
import { CTimeline } from './CTimeline';


interface IDashboardProps {
  storyboard: CStoryboard;
}
interface IDashboardState {
  textToSend: string;
  receivedText: string;
  networkState: INetworkState;
}

class UDashboard extends React.Component<IDashboardProps, IDashboardState> {
  private mHost: BitLabHost;
  constructor(props: IDashboardProps) {
    super(props);

    this.state = {
      textToSend: "",
      receivedText: "",
      networkState: {
        UpTime: 0,
        FreePackets: 0,
        NetState: "unknown",
        EnumeratedDevice: [],
      }
    };

    this.mHost = new BitLabHost();

    setInterval(this.onInterval, 1000);

    setTimeout(() => {
      this.mHost.enumerateDevices();
    }, 3000);
  }

  public render() {
    const textFieldStyle = {
      margin: "5px 10px",
      width: "100px"
    };

    const timelinesByHwId: { [hwId: string]: CTimeline[] } = {};
    const hwIds: string[] = [];
    for (const tl of this.props.storyboard.Timelines) {
      if (!timelinesByHwId[tl.HardwareId]) {
        timelinesByHwId[tl.HardwareId] = [];
        hwIds.push(tl.HardwareId);
      }
      timelinesByHwId[tl.HardwareId].push(tl);
    }

    return (
      <div style={{
        marginLeft: "5px", marginRight: "5px",
        display: "flex", flexDirection: "column"
      }}>
        <Paper style={{
          display: "flex", flexDirection: "column",
          margin: "5px", padding: "5px"
        }} >
          <Typography style={{ margin: "20px 0px" }} variant="h6" >Command line</Typography>
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
          <Typography style={{ margin: "20px 0px" }} variant="h6" >Commands</Typography>
          <div style={{ display: "flex", flexDirection: "row" }} >
            <Button onClick={this.getState}>State</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }} >
            <TextField label="Uptime" InputProps={{ readOnly: true }} style={textFieldStyle}
              value={this.state.networkState.UpTime} />
            <TextField label="Free Packets" InputProps={{ readOnly: true }} style={textFieldStyle}
              value={this.state.networkState.FreePackets} />
            <TextField label="Net State" InputProps={{ readOnly: true }} style={textFieldStyle}
              value={this.state.networkState.NetState} />
          </div>
          <Typography style={{ margin: "10px" }} >Devices</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell numeric>Address</TableCell>
                <TableCell numeric>hwId</TableCell>
                <TableCell numeric>crc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.networkState.EnumeratedDevice.map((device, index) =>
                <TableRow key={index}>
                  <TableCell numeric>{device.address.toString(10).toUpperCase()}</TableCell>
                  <TableCell numeric>{device.hwId.toString(16).toUpperCase()}</TableCell>
                  <TableCell numeric>{device.crc.toString(16).toUpperCase()}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Paper style={{
          display: "flex", flexDirection: "column",
          margin: "5px", padding: "5px"
        }} >
          <Typography style={{ margin: "10px 0px" }} variant="h6" >Output</Typography>
          {hwIds.map((hwId, i) =>
            <div key={i} >
              <Typography style={{ margin: "5px 0px" }} >Board: {hwId}</Typography>
              <div style={{
                margin: "5px", height: "400px",
                display: "flex", flexDirection: "row", overflowX: "auto", overflowY: "hidden"
              }} >
                {timelinesByHwId[hwId].map((timeline, index) => (
                  <UOutput key={index} timeline={timeline} onChange={this.sendDataToSocket} />
                ))}
              </div>
            </div>
          )}
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