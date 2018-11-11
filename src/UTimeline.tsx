import Button from "@material-ui/core/Button";
import * as React from "react";
import { CTimeline, EOutputType } from "./CTimeline";
import UTimelineEntry from "./UTimelineEntry";

import { Add, Remove } from '@material-ui/icons';

import { Dialog, DialogActions, DialogContent, DialogContentText, MenuItem, Paper, TextField, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";
import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer } from "recharts";
// import BStyles from "./BStyles";


class CTimelineProps {
  public timeline: CTimeline;
  public zoomRange: [number, number];
  public onUpdate: () => void;
  public onRemove: (key: number) => void;
}
class CTimelineState {
  public removeDialogOpen: boolean;
}
class UTimeline extends React.Component<CTimelineProps, CTimelineState> {

  constructor(props: CTimelineProps) {
    super(props);
    this.state = {
      removeDialogOpen: false
    };
  }

  public render() {

    const textFieldStyle = {
      marginLeft: "10px",
      marginRight: "10px",
      minWidth: "100px", maxWidth: "150px"
    };

    const removeDialog = (
      <Dialog
        open={this.state.removeDialogOpen}
        onClose={this.closeRemoveConfirmDialog} >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the whole timeline?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.remove}>Remove timeline</Button>
        </DialogActions>
      </Dialog>);

    return (
      <ExpansionPanel key={this.props.timeline.key} style={{ width: "100%" }}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>{this.props.timeline.Name}</Typography>
          <div style={{ width: "calc(100vw - 200px)" }} >
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={this.mCalcDataForGraph()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="time" type="number" tickCount={10} domain={this.props.zoomRange} allowDataOverflow />
                <YAxis type="number" domain={[0, 100]} />
                <Tooltip />
                <Area type="linear" dataKey="value" stroke="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <TextField id="time" label="Name" placeholder="Name" value={this.props.timeline.Name}
                onChange={this.onFieldChanged('name')} margin="normal" style={textFieldStyle} />
              <TextField id="HardwareId" label="HardwareId" placeholder="HardwareId" value={this.props.timeline.HardwareId}
                onChange={this.onFieldChanged('hwId')} margin="normal" style={textFieldStyle} />
              <TextField id="outputId" label="OutputId" placeholder="OutputId"
                value={this.props.timeline.OutputId} margin="normal" style={textFieldStyle}
                onChange={this.onFieldChanged('output')} type="number" />
              <TextField id="outputType" label="Output Type" placeholder="Output Type" value={this.props.timeline.OutputType}
                onChange={this.onFieldChanged('outputType')} select={true} margin="normal" style={textFieldStyle} >
                <MenuItem key={EOutputType.Analog} value={EOutputType.Analog}>Analog</MenuItem>
                <MenuItem key={EOutputType.Digital} value={EOutputType.Digital}>Digital</MenuItem>
              </TextField>
              <Button style={{ margin: "10px" }} mini={true}
                variant="fab" onClick={this.openRemoveConfirmDialog}>
                <Remove />
              </Button>
            </div>
            {removeDialog}
            <div style={{ display: "flex", flexDirection: "row", overflowX: "auto", overflowY: "hidden" }} >
              {this.props.timeline.Entries.length === 0 &&
                <Button style={{ margin: "5px" }} mini color="secondary"
                  variant="fab" onClick={this.addEntry}>
                  <Add />
                </Button>}
              {this.props.timeline.Entries.map((entry, index) =>
                (<Paper key={entry.key} style={{ width: "100px", margin: "5px", padding: "10px" }} >
                  <UTimelineEntry
                    onUpdate={this.onUpdate}
                    entry={entry}
                    removeEntry={this.removeEntry}
                    duplicateEntry={this.duplicateEntry}
                    outputType={this.props.timeline.OutputType} />
                </Paper>)
              )}
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  private mCalcDataForGraph = () => {
    // build ramp from last value to target value after duration
    const data: Array<{ time: number, value: number }> = [];
    let lastValue = 0;
    for (const entry of this.props.timeline.Entries) {
      const entryBegin = { time: entry.Time, value: lastValue };
      const entryEnd = { time: entry.Time + entry.Duration, value: entry.Value };
      lastValue = entry.Value;
      data.push(entryBegin);
      data.push(entryEnd);
    }
    return data;
  }

  private addEntry = () => {
    this.props.timeline.AddEntry(0,0,0);
    this.onUpdate();
  }

  private removeEntry = (key: number) => {
    this.props.timeline.RemoveEntry(key);
    this.onUpdate();
  }

  private duplicateEntry = (key: number) => {
    this.props.timeline.DuplicateEntry(key);
    this.onUpdate();
  }

  private openRemoveConfirmDialog = () => {
    this.setState({ removeDialogOpen: true });
  }
  private closeRemoveConfirmDialog = () => {
    this.setState({ removeDialogOpen: false });
  }

  private remove = () => {
    this.closeRemoveConfirmDialog();
    this.props.onRemove(this.props.timeline.key);
  }

  private onFieldChanged = (fieldName: string) =>
    (e: any) => {
      const newValue = e.target.value;
      switch (fieldName) {
        case 'name': this.props.timeline.Name = newValue; break;
        // TODO: add base 16 field validation
        case 'hwId': this.props.timeline.HardwareId = newValue; break;
        case 'output': this.props.timeline.OutputId = +newValue; break;
        case 'outputType': this.props.timeline.OutputType = +newValue; break;
      }
      this.onUpdate();
    }

  private onUpdate = () => {
    this.setState({});
  }

}

export default UTimeline;
