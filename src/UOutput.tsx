import * as React from "react";
import { CTimeline, CTimelineEntry } from "./CTimeline";
import USlider from "./USlider";


class UOutputProps {
  public timeline: CTimeline;
  public onChange: (value: any) => void;
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
      <div style={{ display: "flex", margin: "20px 10px" }}>
        <USlider min={0} max={CTimelineEntry.MaxValue} step={1} defaultValue={this.state.currValue}
          vertical onChange={this.onChange} label={this.props.timeline.Name} />
      </div>
    );
  }

  private onChange = (value: number) => {
    this.props.onChange(`${this.props.timeline.Name}: ${value}`);
    this.setState({ currValue: value });
  }

}

export default UOutput;
