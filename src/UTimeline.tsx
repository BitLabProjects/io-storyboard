import Button from "@material-ui/core/Button";
import * as React from "react";
import { CTimeline, EOutputType } from "./CTimeline";
import UTimelineEntry from "./UTimelineEntry";

import { Remove } from '@material-ui/icons';

import { Dialog, DialogActions, DialogContent, DialogContentText, Grid, MenuItem, Paper, TextField, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from "@material-ui/core";

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

  // public shouldComponentUpdate(nextProps: CTimelineProps, nextState: CTimelineState): boolean {
  //   let result = (this.state.prevTimeline.compareTo(nextProps.timeline) !== 0);
  //   result = result || (this.state.removeDialogOpen !== nextState.removeDialogOpen);
  //   console.log(this.props.timeline.Name + ': ' + result);
  //   return result;
  // }

  public render() {

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


    const tlData: Array<{ time: number, value: number }> = [];

    this.props.timeline.Entries.forEach((entry) => {
      tlData.push({
        time: entry.Time * 0.001, value: entry.Value
      });
    });

    return (
      <ExpansionPanel key={this.props.timeline.key}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>{this.props.timeline.Name}</Typography>
          <div style={{ width: "calc(100vw - 170px)" }} >
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={tlData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="time" type="number" unit="s" tickCount={10} domain={this.props.zoomRange} allowDataOverflow />
                <YAxis type="number" domain={[0, 100]} />
                <Tooltip />
                <Area type="linear" dataKey="value" stroke="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{ width: "100%" }}>
            <Grid container={true}>
              <Grid item={true} xs={4} >
                <TextField id="time" label="Name" placeholder="Name" value={this.props.timeline.Name}
                  onChange={this.onFieldChanged('name')} margin="normal" fullWidth={true} />
              </Grid>
              <Grid item={true} xs={2}>
                <TextField id="outputId" label="Output" placeholder="Output" value={this.props.timeline.OutputId}
                  onChange={this.onFieldChanged('output')} type="number" margin="normal" fullWidth={true} />
              </Grid>
              <Grid item={true} xs={4}>
                <TextField id="outputType" label="Output Type" placeholder="Output Type" value={this.props.timeline.OutputType}
                  onChange={this.onFieldChanged('outputType')} select={true} margin="normal" fullWidth={true} >
                  <MenuItem key={EOutputType.Analog} value={EOutputType.Analog}>Analog</MenuItem>
                  <MenuItem key={EOutputType.Digital} value={EOutputType.Digital}>Digital</MenuItem>
                </TextField>
              </Grid>
              <Grid item={true} xs={2}>
                <Button style={{ margin: "10px" }} mini={true}
                  variant="fab" onClick={this.openRemoveConfirmDialog}>
                  <Remove />
                </Button>
              </Grid>
            </Grid >
            {removeDialog}
            <div style={{ display: "flex", flexDirection: "row", overflowX: "auto" }} >
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
