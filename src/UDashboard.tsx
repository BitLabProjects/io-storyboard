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
          <div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} variant="fab" onClick={this.sendText}>
                <ImportExportOutlined />
              </Button>
              <Button style={{ margin: "10px" }} onClick={this.toggleLed}>toggle_led</Button>
              <Button style={{ margin: "10px" }} onClick={this.getState}>get_state</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} onClick={this.loadFile}>load_file</Button>
              <Button style={{ margin: "10px" }} onClick={this.uploadFile}>upload_file</Button>
              <Button style={{ margin: "10px" }} onClick={this.checkFile}>check_file</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} onClick={this.openFile}>open_file</Button>
              <Button style={{ margin: "10px" }} onClick={this.closeFile}>close_file</Button>
              <Button style={{ margin: "10px" }} onClick={this.writeFile}>writefile</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} onClick={this.playStoryboard}>play</Button>
              <Button style={{ margin: "10px" }} onClick={this.pauseStoryboard}>pause</Button>
              <Button style={{ margin: "10px" }} onClick={this.stopStoryboard}>stop</Button>
            </div>
          </div>
          <TextField variant={"outlined"} label="Text received" multiline value={this.state.receivedText} />
        </Paper>
        <Paper style={{
          display: "flex", flexDirection: "column",
          margin: "5px", padding: "5px"
        }} >
          <Typography style={{ margin: "20px 0px" }} variant="h6" >Network state</Typography>
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
                {timelinesByHwId[hwId].map((tl, index) => (
                  <UOutput key={index} timeline={tl} onChange={this.setOutput(tl)} />
                ))}
              </div>
            </div>
          )}
        </Paper>
      </div>
    );
  }

  private onInterval = () => {
    this.setState({ receivedText: this.mHost.LastResponse });
  }

  private onTextToSendChanged = (event: any) => {
    this.setState({ textToSend: event.target.value });
  }

  private sendText = async () => {
    await this.mHost.sendText(this.state.textToSend);
  }

  private toggleLed = async () => {
    await this.mHost.toggleLed();
  }
  private getState = async () => {
    this.setState({
      networkState: await this.mHost.getState()
    })
  }
  private setOutput = (tl: CTimeline) => async (value: number) => {
    await this.mHost.setOutput(tl.HardwareId, tl.OutputId, value);
  }

  private loadFile = async () => {
    // TODO
    await this.mHost.loadFile("");
  }
  private uploadFile = async () => {
    await this.mHost.uploadFile();
  }
  private checkFile = async () => {
    await this.mHost.checkFile();
  }
  private openFile = async () => {
    // TODO
    await this.mHost.openFile("", "r");
  }
  private closeFile = async () => {
    await this.mHost.closeFile();
  }
  private writeFile = async () => {
    // TODO
    await this.mHost.writeFile("");
  }

  private playStoryboard = async () => {
    await this.mHost.playStoryboard();
  }
  private pauseStoryboard = async () => {
    await this.mHost.pauseStoryboard();
  }
  private stopStoryboard = async () => {
    await this.mHost.stopStoryboard();
  }

}

export default UDashboard;