import * as React from 'react';

import { Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Grid, Tooltip } from '@material-ui/core';
import { PlayArrow, Pause, Stop, Highlight, List, KeyboardArrowRight, DeveloperBoard } from '@material-ui/icons';

import CStoryboard from './CStoryboard';
import UOutput from './UOutput';
import { BitLabHost, INetworkState } from './BitLabHost';
import { CTimeline } from './CTimeline';

interface IDashboardProps {
  storyboard: CStoryboard;
}
interface IDashboardState {
  receivedText: string;
  isWaitingResponse: boolean;
  networkState: INetworkState;
  commandError: boolean;
}

class UDashboard extends React.Component<IDashboardProps, IDashboardState> {
  private mHost: BitLabHost;
  constructor(props: IDashboardProps) {
    super(props);

    this.state = {
      receivedText: "",
      isWaitingResponse: false,
      networkState: {
        UpTime: 0,
        FreePackets: 0,
        NetState: "unknown",
        EnumeratedDevice: [],
      },
      commandError: false
    };

    this.mHost = new BitLabHost();

    // setInterval(this.onInterval, 1000);
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
            <Typography style={{ margin: "20px 0px" }} variant="h6" >Command line {this.state.isWaitingResponse ? '(Busy)' : ''}</Typography>
            {/* <TextField variant={"outlined"} label="Text to send" multiline
              onChange={this.onTextToSendChanged} value={this.state.textToSend} /> */}
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center" }} >
              {/* <Tooltip title="Send text">
                <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.sendText}><Send /></Button>
              </Tooltip> */}
              <Tooltip title="Toggle LED">
                <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.toggleLed} disabled={this.state.isWaitingResponse}><Highlight /></Button>
              </Tooltip>
              <Tooltip title="Upload storyboard">
                <Button style={{ margin: "10px" }} variant="fab" onClick={this.uploadStoryboard} disabled={this.state.isWaitingResponse}><KeyboardArrowRight /><DeveloperBoard /></Button>
              </Tooltip>
              <Tooltip title="Get state">
                <Button style={{ margin: "10px" }} variant="fab" onClick={this.getState} disabled={this.state.isWaitingResponse}><List /></Button>
              </Tooltip>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.playStoryboard} disabled={this.state.isWaitingResponse}><PlayArrow /></Button>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.pauseStoryboard} disabled={this.state.isWaitingResponse}><Pause /></Button>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.stopStoryboard} disabled={this.state.isWaitingResponse}><Stop /></Button>
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
                    <TableCell numeric>{device.hwId.toUpperCase()}</TableCell>
                    <TableCell numeric>{device.crc.toUpperCase()}</TableCell>
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
                    <UOutput key={index} timeline={tl} onChange={this.setOutput(tl)}
                      disabled={this.state.isWaitingResponse} />
                  ))}
                </div>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }

  /*
  private onInterval = () => {
    this.setState({ receivedText: this.mHost.LastResponse });
  }
  */

  private toggleLed = async () => {
    return this.performCommandAndCheck("toggleLet", () => this.mHost.toggleLed());
  }
  private getState = async () => {
    await this.perform(async () => {
      this.setState({
        networkState: await this.mHost.getState()
      });
    });
  }
  private setOutput = (tl: CTimeline) => {
    return async (value: number) => {
      return this.performCommandAndCheck("setOutput", () => this.mHost.setOutput(tl.HardwareId, tl.OutputId, value));
    }
  }

  private uploadStoryboard = async () => {
    return this.perform(async () => {
      if (!await this.tryCommand("closeFile", () => this.mHost.closeFile())) { return; }
      if (!await this.tryCommand("openFile", () => this.mHost.openFile("/sd/storyboard.json", "w+"))) { return; }

      // Send timeline as base64    
      const maxCharsToSend = 150; // 183;
      const tlStr = JSON.stringify(this.props.storyboard.ExportToJson());
      for (let i = 0; i < tlStr.length; i = i + maxCharsToSend) {
        // btoa: string->base64
        if (!await this.tryCommand("writeFile", () => this.mHost.writeFile(btoa(tlStr.substring(i, i + maxCharsToSend))))) { return; }
      }
      if (!await this.tryCommand("closeFile", () => this.mHost.closeFile())) { return; }

      if (!await this.tryCommand("loadStoryboard", () => this.mHost.loadStoryboard("/sd/storyboard.json"))) { return; }
      if (!await this.tryCommand("uploadStoryboard", () => this.mHost.uploadStoryboard())) { return; }
      if (!await this.tryCommand("checkStoryboards", () => this.mHost.checkStoryboards())) { return; }

      this.setState({ receivedText: "Storyboard uploaded to master board!", commandError: false });
    });
  }

  private playStoryboard = async () => {
    await this.performCommandAndCheck("play", () => this.mHost.playStoryboard());
  }
  private pauseStoryboard = async () => {
    await this.performCommandAndCheck("pause", () => this.mHost.pauseStoryboard());
  }
  private stopStoryboard = async () => {
    await this.performCommandAndCheck("stop", () => this.mHost.stopStoryboard());
  }

  private perform = async (action: () => Promise<any>) => {
    this.setState({ isWaitingResponse: true });
    await action();
    this.setState({ isWaitingResponse: false });
  }
  private performCommandAndCheck = async (commandName: string, action: () => Promise<string[]>) => {
    return this.perform(async () => {
      await this.tryCommand(commandName, action);
    });
  }
  private tryCommand = async (commandName: string, action: () => Promise<string[]>): Promise<boolean> => {
    const result = await action();
    if (result[result.length - 1] !== "Ok") {
      this.setState({ receivedText: `Error on command '${commandName}'`, commandError: true });
      return false;
    }
    this.setState({ receivedText: `Executed '${commandName}'`, commandError: false });
    return true;
  }
}

export default UDashboard;