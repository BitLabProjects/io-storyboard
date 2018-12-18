import * as React from "react";

import { Typography, WithStyles, createStyles, withStyles, Button } from "@material-ui/core";
import { Slider } from "@material-ui/lab";

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  slider: {
    padding: '22px 0px',
  },
  verticalSlider: {
    padding: '0px 22px',
  }
});

interface ISliderProps extends WithStyles<typeof styles> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  vertical?: boolean;
  onChange?: (newValue: number) => void;
  disabled?: boolean;
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

    const vertical = this.props.vertical ? true : false;
    const label = this.props.label ? this.props.label + " " : "";
    if (vertical) {
      return (
        <div className={classes.root} style={{display: "flex", flexDirection: "column"}} >
          <Typography>{label}</Typography>
          <Typography style={{ paddingBottom: "5px" }} variant="caption">({this.state.currValue.toFixed(1)})</Typography>
          <Button style={{ margin: "5px", minHeight: "20px" }} variant="fab" mini onClick={this.setMaxValue}>MAX</Button>
          <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
            <Slider vertical disabled={this.props.disabled}
              classes={{ container: classes.verticalSlider }}
              min={this.props.min} max={this.props.max} step={this.props.step} value={this.state.currValue}
              onChange={this.onChange} />
          </div>
          <Button style={{ margin: "5px", minHeight: "20px" }} variant="fab" mini onClick={this.setMinValue}>MIN</Button>
        </div>
      );
    } else {
      return (
        <div className={classes.root} style={{display: "flex", flexDirection: "row"}} >
          <Typography>{label}</Typography>
          <Typography style={{ paddingBottom: "5px" }} variant="caption">({this.state.currValue.toFixed(1)})</Typography>
          <Button style={{ margin: "5px", minHeight: "20px" }} variant="fab" mini onClick={this.setMinValue}>MIN</Button>
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Slider disabled={this.props.disabled}
              classes={{ container: classes.slider }}
              min={this.props.min} max={this.props.max} step={this.props.step} value={this.state.currValue}
              onChange={this.onChange} />
          </div>
          <Button style={{ margin: "10px", minHeight: "20px" }} variant="fab" mini onClick={this.setMaxValue}>MAX</Button>
        </div>
      );
    }
  }

  private setMinValue = () => {
    this.onUpdateValue(this.props.min);    
  }
  private setMaxValue = () => {
    this.onUpdateValue(this.props.max);    
  }
  private onChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.onUpdateValue(value);
  }

  private onUpdateValue = (newValue: number) => {
    this.setState({ currValue: newValue });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

}



export default withStyles(styles)(USlider);