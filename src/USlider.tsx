import * as React from "react";

import { Typography, WithStyles, createStyles, withStyles } from "@material-ui/core";
import { Slider } from "@material-ui/lab";

const styles = createStyles({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px"
  }
});

interface ISliderProps extends WithStyles<typeof styles> {
  label?: string;
  min?: number;
  max: number;
  step?: number;
  defaultValue: number;
  vertical?: boolean;
  onChange?: (newValue: number) => void;
  onValueApplied?: (newValue: number) => void;
}
interface ISliderState {
  currValue: number;
}
class USlider extends React.Component<ISliderProps, ISliderState> {

  constructor(props: ISliderProps) {
    super(props);
    this.state = {
      currValue: this.props.defaultValue
    };
  }

  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} >
        <Typography style={{ padding: "10px 0" }} >{this.props.label || ""}&nbsp;({this.state.currValue})</Typography>
        <div style={{ width: this.props.vertical ? "auto" : "100%", height: "100%", display: "flex" }}>
          <Slider vertical={this.props.vertical}
            min={this.props.min} max={this.props.max} step={this.props.step}
            value={this.state.currValue} onChange={this.onChange} onDragEnd={this.onValueApplied} />
        </div>
      </div>
    );
  }

  private onChange = (event: React.ChangeEvent<{}>, value: number) => {
    if (this.props.onChange) {
      this.props.onChange(this.state.currValue);
    }
    this.setState({ currValue: value });
  }

  private onValueApplied = () => {
    if (this.props.onValueApplied) {
      this.props.onValueApplied(this.state.currValue);
    }
  }

}



export default withStyles(styles)(USlider);