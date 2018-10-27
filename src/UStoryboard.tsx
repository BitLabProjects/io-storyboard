import * as React from 'react';

import UTimeline from './UTimeline';

import { Add, ImportExport } from '@material-ui/icons';

import Button from '@material-ui/core/Button';
import CStoryboard from './CStoryboard';
import USlider from './USlider';

class UStoryboardProps {
  public storyboard: CStoryboard;
}

class UStoryboardState {
  public zoomRange: [number, number];
}
class UStoryboard extends React.Component<UStoryboardProps, UStoryboardState> {

  private mMaxTime: number;

  constructor(props: UStoryboardProps) {
    super(props);
    this.mMaxTime = this.props.storyboard.MaxTime * 0.001;
    this.state = {
      zoomRange: [0, this.mMaxTime]
    };
  }

  public render() {
    this.mMaxTime = this.props.storyboard.MaxTime * 0.001;
    const timelines = this.props.storyboard.Timelines.map((tl) =>
      <UTimeline
        onUpdate={this.onUpdate}
        key={tl.key}
        timeline={tl}
        zoomRange={this.state.zoomRange}
        onRemove={this.removeTimeline} />
    );

    return (
      <div style={{ margin: "0px 5px" }}>
        <div style={{ margin: "10px" }}>
          <USlider label="Zoom start" min={0} max={this.mMaxTime} step={1}
            defaultValue={this.state.zoomRange[0]} onValueApplied={this.onZoomChange("start")} />
          <USlider label="Zoom end" min={0} max={this.mMaxTime} step={1}
            defaultValue={this.state.zoomRange[1]} onValueApplied={this.onZoomChange("end")} />
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
    (value: number) => {
      let [start, end] = this.state.zoomRange;
      switch (field) {
        case "start": start = value; break;
        case "end": end = value; break;
      }
      this.setState({ zoomRange: [start, end] });
    }

  private addTimeline = () => {
    this.props.storyboard.AddTimeline();
    this.onUpdate();
  };

  private removeTimeline = (key: number) => {
    this.props.storyboard.RemoveTimeline(key);
    this.onUpdate();
  };

  private onUpdate = () => {
    this.setState({});
  }

  private exportStoryboard = () => {
    const text = this.props.storyboard.ExportToJson();
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