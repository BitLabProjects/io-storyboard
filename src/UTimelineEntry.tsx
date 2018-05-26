import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { CTimelineEntry, EOutputType } from "./CTimeline";

import { Grid } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import RemoveIcon from '@material-ui/icons/Remove';
// import BStyles from "./BStyles";

class CTimelineEntryProps {
  public entry: CTimelineEntry;
  public outputType: EOutputType;
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
      <Grid container={true} >
        <Grid item={true} xs={3} >
          <TextField id="time" label="Time" placeholder="Time" value={this.state.entry.Time}
            onChange={this.onFieldChanged('time')} type="number" margin="normal" fullWidth={true} />
        </Grid>
        <Grid item={true} xs={3}>
          {this.props.outputType === EOutputType.Analog ?
            (<TextField id="value" label="Value" placeholder="Value" value={this.state.entry.Value}
              onChange={this.onFieldChanged('value')} type="number" margin="normal" fullWidth={true} />) :
            (<Switch
              checked={this.state.entry.Value > 0}
              color="primary"
              onChange={this.onFieldChanged('digitalValue')}
              value="digitalValue"
            />
            )}
        </Grid>
        {this.props.outputType === EOutputType.Analog && (
          <Grid item={true} xs={3}>
            <TextField id="duration" label="Duration" placeholder="Duration" value={this.state.entry.Duration}
              onChange={this.onFieldChanged('duration')} type="number" margin="normal" fullWidth={true} />
          </Grid>
        )}
        <Grid item={true} xs={3}>
          <Button style={{ margin: "10px" }} mini={true} color="secondary"
            variant="fab" onClick={this.removeEntry.bind(that)}>
            <RemoveIcon />
          </Button>
        </Grid>
      </Grid>
    );
  }

  private onFieldChanged(fieldName: string) {
    return ((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      switch (fieldName) {
        // operator '+' convert any object to number          
        case 'time': this.state.entry.Time = +newValue; break;
        case 'value': this.state.entry.Value = +newValue; break;
        case 'digitalValue': e.target.checked ? this.state.entry.Value = 100 : this.state.entry.Value = 0; break;
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
