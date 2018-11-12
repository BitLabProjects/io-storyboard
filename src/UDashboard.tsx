import * as React from 'react';

import { Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { PlayArrow, Pause, Stop } from '@material-ui/icons';

import CStoryboard from './CStoryboard';
import UOutput from './UOutput';
import { BitLabHost, INetworkState } from './BitLabHost';
import { CTimeline } from './CTimeline';
import { Format } from './Utils/Format';


interface IDashboardProps {
  storyboard: CStoryboard;
}
interface IDashboardState {
  receivedText: string;
  isWaitingResponse: boolean;
  networkState: INetworkState;
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
          <Typography style={{ margin: "20px 0px" }} variant="h6" >Command line {this.state.isWaitingResponse ? "(busy)" : ""}</Typography>
          <div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} onClick={this.toggleLed}>toggle_led</Button>
              <Button style={{ margin: "10px" }} onClick={this.getState}>get_state</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} onClick={this.loadStoryboard}>load_storyboard</Button>
              <Button style={{ margin: "10px" }} onClick={this.uploadStoryboard}>upload_storyboard</Button>
              <Button style={{ margin: "10px" }} onClick={this.checkStoryboard}>check_storyboard</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} onClick={this.openFile}>open_file</Button>
              <Button style={{ margin: "10px" }} onClick={this.closeFile}>close_file</Button>
              <Button style={{ margin: "10px" }} onClick={this.writeFile}>write_file</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.playStoryboard}><PlayArrow /></Button>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.pauseStoryboard}><Pause /></Button>
              <Button style={{ margin: "10px" }} variant="fab" mini onClick={this.stopStoryboard}><Stop /></Button>
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
                <TableCell numeric>crc (from device)</TableCell>
                <TableCell numeric>crc (computed)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.networkState.EnumeratedDevice.map((device, index) =>
                <TableRow key={index}>
                  <TableCell numeric>{device.address.toString(10).toUpperCase()}</TableCell>
                  <TableCell numeric>{device.hwId}</TableCell>
                  <TableCell numeric>{device.crc}</TableCell>
                  <TableCell numeric>{Format.numberUInt32ToHex(index === 0 ? this.props.storyboard.calcCrc32(null, 0)
                                                                           : this.props.storyboard.calcCrc32(device.hwId, 0))}</TableCell>
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

  private toggleLed = async () => {
    await this.perform(() => this.mHost.toggleLed());
  }
  private getState = async () => {
    await this.perform(async () => {
      this.setState({
        networkState: await this.mHost.getState()
      });
    });
  }
  private setOutput = (tl: CTimeline) => async (value: number) => {
    await this.perform(() => this.mHost.setOutput(tl.HardwareId, tl.OutputId, value));
  }

  private loadStoryboard = async () => {
    // TODO
    await this.perform(() => this.mHost.loadStoryboard("/sd/storyboard.json"));
  }
  private uploadStoryboard = async () => {
    await this.perform(() => this.mHost.uploadStoryboard());
  }
  private checkStoryboard = async () => {
    await this.perform(() => this.mHost.checkStoryboards());
  }
  private openFile = async () => {
    // TODO
    await this.perform(() => this.mHost.openFile("/sd/storyboard.json", "w+"));
  }
  private closeFile = async () => {
    await this.perform(() => this.mHost.closeFile());
  }
  private writeFile = async () => {
    await this.perform(async () => {
      // Send timeline as base64    
      const maxCharsToSend = 183;
      const tlStr = JSON.stringify(this.props.storyboard.ExportToJson());
      for (let i = 0; i < tlStr.length; i = i + maxCharsToSend) {
        // btoa: string->base64
        await this.mHost.writeFile(btoa(tlStr.substring(i, i + maxCharsToSend)));
      }
    });
  }

  private playStoryboard = async () => {
    await this.perform(() => this.mHost.playStoryboard());
  }
  private pauseStoryboard = async () => {
    await this.perform(() => this.mHost.pauseStoryboard());
  }
  private stopStoryboard = async () => {
    await this.perform(() => this.mHost.stopStoryboard());
  }

  private perform = async(action: () => Promise<any>) => {
    this.setState({isWaitingResponse: true});
    await action();
    this.setState({isWaitingResponse: false});
  }
}

export default UDashboard;