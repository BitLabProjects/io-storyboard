import * as React from 'react';

import UTimeline from './UTimeline';

import { Add, ImportExport } from '@material-ui/icons';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CStoryboard from './CStoryboard';
import { Slider } from '@material-ui/lab';

class UStoryboardProps {
  public storyboard: CStoryboard;
}

class UStoryboardState {
  public storyboard: CStoryboard;
  public zoomRangePreview: [number, number];
  public zoomRange: [number, number];
}
class UStoryboard extends React.Component<UStoryboardProps, UStoryboardState> {
  constructor(props: UStoryboardProps) {
    super(props);
    this.state = {
      storyboard: this.props.storyboard.clone(),
      zoomRangePreview: [0, 350000],
      zoomRange: [0, 350000]
    };
  }

  public render() {

    const timelines = this.state.storyboard.Timelines.map((tl) =>
      <UTimeline
        onUpdate={this.onUpdate}
        key={tl.key}
        timeline={tl}
        zoomRange={this.state.zoomRange}
        onRemove={this.removeTimeline} />
    );

    return (
      <div style={{ marginLeft: "5px", marginRight: "5px" }}>
        <Typography style={{ margin: "40px 0" }} variant="h6" >Storyboard mode</Typography>
        <div style={{ padding: "20px" }}>
          <Typography style={{ margin: "10px 0" }} variant="subtitle1" >Zoom start&nbsp;({this.state.zoomRangePreview[0]})</Typography>
          <Slider style={{ padding: "10px 0px" }}
            min={0} max={350000} step={5000}
            value={this.state.zoomRangePreview[0]} onChange={this.onZoomChange("start")} onDragEnd={this.onZoomApply} />
          <Typography style={{ margin: "10px 0" }} variant="subtitle1" >Zoom end&nbsp;({this.state.zoomRangePreview[1]})</Typography>
          <Slider style={{ padding: "10px 0px" }}
            min={0} max={350000} step={5000}
            value={this.state.zoomRangePreview[1]} onChange={this.onZoomChange("end")} onDragEnd={this.onZoomApply} />
        </div>
        {timelines}
        <Button style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="primary"
          variant="fab"
          onClick={this.addTimeline}>
          <Add />
        </Button>
        <Button style={{ position: "fixed", bottom: "80px", right: "10px" }}
          variant="fab"
          onClick={this.exportStoryboard}>
          <ImportExport />
        </Button>
      </div>
    );
  }

  private onZoomChange = (field: string) =>
    (event: React.ChangeEvent<{}>, value: number) => {
      let [start, end] = this.state.zoomRange;
      switch (field) {
        case "start": start = value; break;
        case "end": end = value; break;
      }
      this.setState({ zoomRangePreview: [start, end] });
    }

  private onZoomApply = () => {
    this.setState({ zoomRange: this.state.zoomRangePreview });
  }

  private addTimeline = () => {
    this.state.storyboard.AddTimeline();
    this.onUpdate();
  };

  private removeTimeline = (key: number) => {
    this.state.storyboard.RemoveTimeline(key);
    this.onUpdate();
  };

  private onUpdate = () => {
    this.setState({ storyboard: this.state.storyboard.clone() });
  }

  private exportStoryboard = () => {
    const text = this.state.storyboard.ExportToJson();
    // download file json
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "timeline.json");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };


}

export default UStoryboard;