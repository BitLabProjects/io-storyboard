import { Divider, Typography } from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import * as React from "react";
import { CTimeline } from "./CTimeline";


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
      <div style={{ margin: "5px" }} >
        <Typography>{this.props.timeline.Name}</Typography>
        <Slider style={{ padding: "22px 0" }} step={1} value={this.state.currValue} onChange={this.onChange} />
        <Divider />
      </div>
    );
  }

  private onChange = (event: any, value: any) => {
    this.props.onChange( `${this.props.timeline.Name}: ${value}`);
    this.setState({ currValue: value });
  }

}

export default UOutput;
