import Button from "material-ui/Button";
import * as React from "react";
import { CTimeline, EOutputType } from "./CTimeline";
import UTimelineEntry from "./UTimelineEntry";

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { MenuItem, Paper, TextField } from "material-ui";
import BStyles from "./BStyles";

class CTimelineProps {
  public timeline: CTimeline
  public onRemove: (key: number) => void;
  public onUpdate: () => void;
}
class CTimelineState {
  public timeline: CTimeline
}
class UTimeline extends React.Component<CTimelineProps, CTimelineState> {

  private thisInstance: UTimeline;

  constructor(props: CTimelineProps) {
    super(props);
    this.thisInstance = this;
    this.state = { timeline: props.timeline };
  }

  public render() {
    const entries = this.state.timeline.Entries.map((entry) => {
      return (
        <Paper key={entry.Key} style={{ margin: "5px", padding: "15px" }} >
          <UTimelineEntry
            entry={entry}
            removeEntry={this.removeEntry.bind(this.thisInstance)}
            outputType={this.state.timeline.OutputType} />
        </Paper>
      );
    });

    return (
      <div>
        <TextField
          id="time"
          label="Name"
          placeholder="Name"
          value={this.state.timeline.Name}
          onChange={this.onFieldChanged('name')}
          margin="normal"
          style={BStyles.TextFieldStyle} />
        <TextField
          id="outputId"
          label="Output"
          placeholder="Output"
          value={this.state.timeline.OutputId}
          onChange={this.onFieldChanged('output')}
          type="number"
          margin="normal"
          style={BStyles.TextFieldStyle} />
        <TextField
          id="outputType"
          label="Output Type"
          placeholder="Output Type"
          value={this.state.timeline.OutputType}
          onChange={this.onFieldChanged('outputType')}
          select={true}
          margin="normal"
          style={BStyles.TextFieldStyle}>
          <MenuItem key={EOutputType.Analog} value={EOutputType.Analog}>
            Analog
          </MenuItem>
          <MenuItem key={EOutputType.Digital} value={EOutputType.Digital}>
            Digital
          </MenuItem>
        </TextField>
        <Button style={{ margin: "10px" }}
          variant="fab"
          onClick={this.remove.bind(this.thisInstance)}>
          <RemoveIcon />
        </Button>
        {entries}
        <div>
          <Button style={{ margin: "10px" }}
            variant="fab"
            onClick={this.addEntry.bind(this.thisInstance)}>
            <AddIcon />
          </Button>
        </div>
      </div>
    );
  }

  private addEntry() {
    this.state.timeline.AddEntry(0, 0);
    this.forceUpdate();
  }

  private removeEntry(key: number) {
    this.state.timeline.RemoveEntry(key);
    this.forceUpdate();
  }

  private remove() {
    this.props.onRemove(this.state.timeline.Key);
  }

  private onFieldChanged(fieldName: string) {
    return ((e: any) => {
      const newValue = e.target.value;
      switch (fieldName) {
        case 'name': this.state.timeline.Name = newValue; break;
        case 'output': this.state.timeline.OutputId = +newValue; break;
        case 'outputType': this.state.timeline.OutputType = +newValue; break;
      }
      this.props.onUpdate();
      this.forceUpdate();
    });
  }

}

export default UTimeline;
