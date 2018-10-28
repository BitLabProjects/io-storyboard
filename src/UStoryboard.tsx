import * as React from 'react';

import UTimeline from './UTimeline';

import { Add, Share } from '@material-ui/icons';

import Button from '@material-ui/core/Button';
import CStoryboard from './CStoryboard';
import USlider from './USlider';
import { Typography } from '@material-ui/core';
import { SortOutlined } from '@material-ui/icons';

import { arrayMove, SortableContainer, SortableElement, SortableHandle, SortEnd, SortEvent } from "react-sortable-hoc";
import { CTimeline } from './CTimeline';

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
    this.mMaxTime = this.props.storyboard.MaxTime;
    this.state = {
      zoomRange: [0, this.mMaxTime]
    };
  }

  public render() {
    this.mMaxTime = this.props.storyboard.MaxTime;

    const DragHandle = SortableHandle(() => <SortOutlined style={{ margin: "5px" }} />);

    const SortableItem = SortableElement<{ value: CTimeline }>(({ value }) =>
      <div style={{ display: "flex", alignItems: "center" }} key={value.key}>
        <DragHandle />
        <UTimeline
          onUpdate={this.onUpdate}
          timeline={value}
          zoomRange={this.state.zoomRange}
          onRemove={this.removeTimeline} />
      </div>
    );


    const SortableList = SortableContainer<{ items: CTimeline[] }>(({ items }) => {
      return (
        <div style={{ overflowX: "auto" }}>
          {items.map((item, index) => (
            <SortableItem key={item.key} index={index} value={item} />
          ))}
        </div>
      )
    });

    return (
      <div style={{ margin: "0px 5px" }}>
        <Typography style={{ margin: "10px", fontStyle: "italic" }} >All time values are expressed in seconds</Typography>
        <div style={{ margin: "10px" }}>
          <USlider label="Zoom start" min={0} max={this.mMaxTime} step={1}
            defaultValue={this.state.zoomRange[0]} onValueApplied={this.onZoomChange("start")} />
          <USlider label="Zoom end" min={0} max={this.mMaxTime} step={1}
            defaultValue={this.state.zoomRange[1]} onValueApplied={this.onZoomChange("end")} />
        </div>
        <SortableList lockAxis="y" useDragHandle
          items={this.props.storyboard.Timelines} onSortEnd={this.onSortEnd} />
        <Button style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="primary"
          variant="fab"
          onClick={this.addTimeline}>
          <Add />
        </Button>
        <Button style={{ position: "fixed", bottom: "80px", right: "10px" }}
          variant="fab"
          onClick={this.exportStoryboard}>
          <Share />
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

  private onSortEnd = (sort: SortEnd, event: SortEvent) => {
    this.props.storyboard.Timelines = arrayMove<CTimeline>(this.props.storyboard.Timelines, sort.oldIndex, sort.newIndex);
    this.onUpdate();
  };

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