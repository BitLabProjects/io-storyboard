import Button from "material-ui/Button";

import TextField from "material-ui/TextField";
import * as React from "react";
import { CTimelineEntry } from "./CTimeline";

import RemoveIcon from '@material-ui/icons/Remove';

class CTimelineEntryProps {
  public entry: CTimelineEntry;
  public removeEntry: (key: number) => void;  
}
class UTimelineEntryState {
  public entry: CTimelineEntry;
}
class UTimelineEntry extends React.Component<CTimelineEntryProps, UTimelineEntryState> {

  constructor(props: CTimelineEntryProps) {
    super(props);
    this.state = { entry: props.entry };
  }

  public render() {
    const that = this;
    return (
      <div>
        <span>
          <TextField
            id="time"
            label="Start time"
            placeholder="Start time"
            value={this.state.entry.Time}
            onChange={this.onFieldChanged('time')}
            type="number"
            margin="normal"
          />          
          <TextField
            id="value"
            label="Value"
            placeholder="Value"
            value={this.state.entry.Value}
            onChange={this.onFieldChanged('value')}
            type="number"
            margin="normal"
            />
          <TextField
            id="duration"
            label="Ramp duration"
            placeholder="Ramp duration"
            value={this.state.entry.Duration}
            onChange={this.onFieldChanged('duration')}
            type="number"
            margin="normal"
          />
        </span>        
        <span>
          <Button style={{ margin: "10px" }}
            color="secondary"
            variant="fab"
            onClick={this.removeEntry.bind(that)}>
            <RemoveIcon />
          </Button>
        </span>
      </div>
    );
  }

  private onFieldChanged(fieldName: string) {
    return ((e: any) => {
      const newValue = e.target.value;
      switch (fieldName) {
        // operator '+' convert any object to number          
        case 'time': this.state.entry.Time = +newValue; break;
        case 'value': this.state.entry.Value = +newValue; break;
        case 'duration': this.state.entry.Duration = +newValue; break;
      }
      this.forceUpdate();
    });
  }

  private removeEntry() {
    this.props.removeEntry(this.state.entry.Key);
  }

}

export default UTimelineEntry;
