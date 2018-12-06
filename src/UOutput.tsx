import * as React from "react";
import { CTimeline, CTimelineEntry } from "./CTimeline";
import USlider from "./USlider";
import { Timer } from "./Utils/Timer";


interface IOutputProps {
  timeline: CTimeline;
  onChange: (value: number) => void;
  disabled?: boolean;
}

class UOutput extends React.Component<IOutputProps, {}> {

  constructor(props: IOutputProps) {
    super(props);
    this.state = { currValue: 0 }
  }

  public render() {
    return (
      <div style={{ display: "flex", margin: "10px" }}>
        <USlider min={0} max={CTimelineEntry.MaxValue} step={1} defaultValue={this.props.timeline.ManualModeValue}
          vertical onChange={Timer.debounce(this.onChange, 250)} label={this.props.timeline.Name}
          disabled={this.props.disabled} />
      </div>
    );
  }

  private onChange = (value: number) => {
    this.props.onChange(value);
  }

}

export default UOutput;
