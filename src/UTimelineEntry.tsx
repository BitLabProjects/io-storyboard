import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { CTimelineEntry, EOutputType } from "./CTimeline";

import { Grid } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import RemoveIcon from '@material-ui/icons/Remove';
import { Slider } from "@material-ui/lab";
// import BStyles from "./BStyles";

class CTimelineEntryProps {
  public entry: CTimelineEntry;
  public outputType: EOutputType;
  public onUpdate: () => void;
  public removeEntry: (key: number) => void;
}
class UTimelineEntryState {
}
class UTimelineEntry extends React.Component<CTimelineEntryProps, UTimelineEntryState> {

  constructor(props: CTimelineEntryProps) {
    super(props);
  }

  // public shouldComponentUpdate(nextProps: CTimelineEntryProps, nextState: UTimelineEntryState): boolean {
  //   return (this.props.entry.compareTo(nextProps.entry) !== 0);
  // }

  public render() {
    const that = this;
    return (
      <Grid container={true} alignItems="center" spacing={16} >
        <Grid item={true} xs={3} >
          <TextField id="time" label="Time" placeholder="Time" 
            value={this.props.entry.Time}
            onChange={this.onFieldChanged('time')} type="number" margin="normal" fullWidth={true} />
        </Grid>
        <Grid item={true} xs={4}>
          {this.props.outputType === EOutputType.Analog ?
            (<Slider style={{ padding: "22px 0" }} min={0} max={100} step={1}
              value={this.props.entry.Value}
              onChange={this.onSliderChanged} />) :
            (<Switch
              checked={this.props.entry.Value > 0}
              color="primary"
              onChange={this.onFieldChanged('digitalValue')}
              value="digitalValue"
            />
            )}
        </Grid>
        {this.props.outputType === EOutputType.Analog && (
          <Grid item={true} xs={3}>
            <TextField id="duration" label="Duration" placeholder="Duration" value={this.props.entry.Duration}
              onChange={this.onFieldChanged('duration')} type="number" margin="normal" fullWidth={true} />
          </Grid>
        )}
        <Grid item={true} xs={2}>
          <Button style={{ margin: "10px" }} mini={true} color="secondary"
            variant="fab" onClick={this.removeEntry.bind(that)}>
            <RemoveIcon />
          </Button>
        </Grid>
      </Grid>
    );
  }

  private onFieldChanged = (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      switch (fieldName) {
        // operator '+' convert any object to number          
        case 'time': this.props.entry.Time = +newValue; break;
        case 'digitalValue': e.target.checked ? this.props.entry.Value = 100 : this.props.entry.Value = 0; break;
        case 'duration': this.props.entry.Duration = +newValue; break;
      }
      this.props.onUpdate();
    }

  private onSliderChanged = (event: React.ChangeEvent<{}>, value: number) => {
    this.props.entry.Value = value;
    this.props.onUpdate();
  }

  private removeEntry = () => {
    this.props.removeEntry(this.props.entry.key);
  }

}

export default UTimelineEntry;
