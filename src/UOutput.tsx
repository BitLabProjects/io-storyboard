import * as React from "react";
import { CTimeline, CTimelineEntry } from "./CTimeline";
import USlider from "./USlider";


class UOutputProps {
  public timeline: CTimeline;
  public onChange: (value: number) => void;
  public disabled?: boolean;
}
class UOutputState {
  public currValue: number;
}
class UOutput extends React.Component<UOutputProps, UOutputState> {

  constructor(props: UOutputProps) {
    super(props);
    this.state = { currValue: 0 }
  }

  public render() {
    return (
      <div style={{ display: "flex", margin: "10px" }}>
        <USlider min={0} max={CTimelineEntry.MaxValue} step={1} defaultValue={this.state.currValue}
          vertical onChange={this.onChange} label={this.props.timeline.Name}
          disabled={this.props.disabled} />
      </div>
    );
  }

  private onChange = (value: number) => {
    this.props.onChange(value);
    this.setState({ currValue: value });
  }

}

export default UOutput;
