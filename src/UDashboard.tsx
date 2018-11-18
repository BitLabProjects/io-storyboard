import * as React from 'react';

import { Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Grid, Tooltip } from '@material-ui/core';
import { PlayArrow, Pause, Stop, Highlight, List, Send, KeyboardArrowRight, DeveloperBoard } from '@material-ui/icons';

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
  commandError: boolean;
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
      },
      commandError: false
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
      <Grid container spacing={8} >
        <Grid item xs={12} sm={6} >
          <Paper style={{
            display: "flex", flexDirection: "column",
            margin: "5px", padding: "5px"
          }} >
            <Typography style={{ margin: "20px 0px" }} variant="h6" >Command line</Typography>
            <TextField variant={"outlined"} label="Text to send" multiline
              onChange={this.onTextToSendChanged} value={this.state.textToSend} />
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center" }} >
              <Tooltip title="Send text">
                <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.sendText}><Send /></Button>
              </Tooltip>
              <Tooltip title="Toggle LED">
                <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.toggleLed}><Highlight /></Button>
              </Tooltip>
              <Tooltip title="Upload storyboard">
                <Button style={{ margin: "10px" }} variant="fab" onClick={this.uploadStoryboard}><KeyboardArrowRight /><DeveloperBoard /></Button>
              </Tooltip>
              <Tooltip title="Get state">
                <Button style={{ margin: "10px" }} variant="fab" onClick={this.getState}><List /></Button>
              </Tooltip>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.playStoryboard}><PlayArrow /></Button>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.pauseStoryboard}><Pause /></Button>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.stopStoryboard}><Stop /></Button>
            </div>
            <TextField variant={"outlined"} label="Text received" multiline value={this.state.receivedText} error={this.state.commandError} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12}>
          <Paper style={{
            display: "flex", flexDirection: "column",
            margin: "5px", padding: "5px"
          }} >
            <Typography style={{ margin: "10px 0px" }} variant="h6" >Output</Typography>
            {hwIds.map((hwId, i) =>
              <div key={i} >
                <Typography>Board: {hwId}</Typography>
                <div style={{
                  height: "200px", overflowX: "auto", overflowY: "hidden",
                  display: "flex", flexDirection: "row"
                }} >
                  {timelinesByHwId[hwId].map((tl, index) => (
                    <UOutput key={index} timeline={tl} onChange={this.setOutput(tl)} />
                  ))}
                </div>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
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

  private uploadStoryboard = async () => {
    let response = (await this.mHost.closeFile())[0];
    if (response !== "Ok") {
      this.setState({ receivedText: "Error on closing file", commandError: true }); return;
    }
    response = (await this.mHost.openFile("/sd/storyboard.json", "w+"))[0];
    if (response !== "Ok") {
      this.setState({ receivedText: "Error on opening file", commandError: true }); return;
    }
    // Send timeline as base64    
    const maxCharsToSend = 150; // 183;
    const tlStr = JSON.stringify(this.props.storyboard.ExportToJson());
    for (let i = 0; i < tlStr.length; i = i + maxCharsToSend) {
      // btoa: string->base64
      await this.mHost.writeFile(btoa(tlStr.substring(i, i + maxCharsToSend)));
      response = (await this.mHost.closeFile())[0];
      if (response !== "Ok") {
        this.setState({ receivedText: "Error on writing file", commandError: true }); return;
      }
    }
    response = (await this.mHost.closeFile())[0];
    if (response !== "Ok") {
      this.setState({ receivedText: "Error on closing file", commandError: true }); return;
    }
    response = (await this.mHost.loadFile("/sd/storyboard.json"))[0];
    if (response !== "Ok") {
      this.setState({ receivedText: "Error on loading file on master board", commandError: true }); return;
    }
    response = (await this.mHost.uploadFile())[0];
    if (response !== "Ok") {
      this.setState({ receivedText: "Error on uploading file to slave boards", commandError: true }); return;
    }
    response = (await this.mHost.checkFile())[0];
    if (response !== "Ok") {
      this.setState({ receivedText: "Error on checking file", commandError: true }); return;
    }
    this.setState({ receivedText: "Storyboard uploaded to master board!", commandError: false });
  }

  private playStoryboard = async () => {
    if ((await this.mHost.playStoryboard())[0] !== "Ok") {
      this.setState({ receivedText: "Storyboard playing!", commandError: false });
    }
    else {
      this.setState({ receivedText: "Error on storyboard playing", commandError: true });
    }
  }
  private pauseStoryboard = async () => {
    if ((await this.mHost.pauseStoryboard())[0] !== "Ok") {
      this.setState({ receivedText: "Storyboard playing!", commandError: false });
    }
    else {
      this.setState({ receivedText: "Error on storyboard playing", commandError: true });
    }
  }
  private stopStoryboard = async () => {
    if ((await this.mHost.stopStoryboard())[0] !== "Ok") {
      this.setState({ receivedText: "Storyboard playing!", commandError: false });
    }
    else {
      this.setState({ receivedText: "Error on storyboard playing", commandError: true });
    }
  }

}

export default UDashboard;