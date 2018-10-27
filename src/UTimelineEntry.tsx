import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { CTimelineEntry, EOutputType } from "./CTimeline";

import Switch from "@material-ui/core/Switch";
import { Add, Remove } from '@material-ui/icons';
import USlider from "./USlider";
// import BStyles from "./BStyles";

class CTimelineEntryProps {
  public entry: CTimelineEntry;
  public outputType: EOutputType;
  public onUpdate: () => void;
  public removeEntry: (key: number) => void;
  public duplicateEntry: (key: number) => void;
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
    return (
      <div>
        <TextField id="time" label="Time" placeholder="Time"
          value={this.props.entry.Time}
          onChange={this.onFieldChanged('time')} type="number" margin="normal" fullWidth={true} />
        <div style={{ height: "200px", margin: "10px" }}>
          {this.props.outputType === EOutputType.Analog ?
            (<USlider vertical step={1}
              min={0} max={CTimelineEntry.MaxValue} defaultValue={this.props.entry.Value}
              onChange={this.onSliderChanged} />) :
            (<Switch
              checked={this.props.entry.Value > 0}
              color="primary"
              onChange={this.onFieldChanged('digitalValue')}
              value="digitalValue" />)}
        </div>
        {this.props.outputType === EOutputType.Analog && (
          <TextField id="duration" label="Duration" placeholder="Duration" value={this.props.entry.Duration}
            onChange={this.onFieldChanged('duration')} type="number" margin="normal" fullWidth={true} />
        )}
        <div style={{ display: "flex", flexDirection: "row" }} >
          <Button style={{ margin: "5px" }} mini={true} color="secondary"
            variant="fab" onClick={this.removeEntry}>
            <Remove />
          </Button>
          <Button style={{ margin: "5px" }} mini={true} color="secondary"
            variant="fab" onClick={this.addEntryAfterMe}>
            <Add />
          </Button>
        </div>
      </div>
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

  private onSliderChanged = (value: number) => {
    this.props.entry.Value = value;
    this.props.onUpdate();
  }

  private removeEntry = () => {
    this.props.removeEntry(this.props.entry.key);
  }

  private addEntryAfterMe = () => {
    this.props.duplicateEntry(this.props.entry.key);
  }

}

export default UTimelineEntry;
