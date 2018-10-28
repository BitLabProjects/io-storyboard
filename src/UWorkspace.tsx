import * as React from "react";
import { CTimeline } from "./CTimeline";

import { Check, SortOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { Divider, Button } from "@material-ui/core";
import CStoryboard from "./CStoryboard";
import USlider from "./USlider";
import UWorkspaceTimeline from "./UWorkspaceTimeline";

import { SortableContainer, SortableElement, SortableHandle, SortEnd, SortEvent, arrayMove } from "react-sortable-hoc";

interface IWorkspaceProps {
  storyboard: CStoryboard;
  zoomRange: [number, number];
  timelinesVisibility: boolean[];
  onZoomChange: (field: string) => (newValue: number) => void;
  onWorkspaceApplied: () => void;
}

class UWorkspace extends React.Component<IWorkspaceProps, {}> {

  public render() {

    const DragHandle = SortableHandle(() => <SortOutlined style={{ margin: "5px" }} />);
    const SortableItem = SortableElement<{ value: CTimeline, sortIndex: number }>(({ value, sortIndex }) =>
      <div style={{ display: "flex", alignItems: "center" }} key={value.key}>
        <DragHandle />
        <UWorkspaceTimeline
          timeline={value} visible={this.props.timelinesVisibility[sortIndex]}
          onVisibilityChanged={this.onVisibilityChanged(sortIndex)}
          onMoveToTop={this.mMoveTimelineToTop(sortIndex)}
          onMoveToBottom={this.mMoveTimelineToBottom(sortIndex)} />
      </div>
    );
    const SortableList = SortableContainer<{ items: CTimeline[] }>(({ items }) => {
      return (
        <div style={{ display: "flex", flexWrap: "wrap" }} >
          {items.map((item, index) => (
            <SortableItem key={item.key} index={index} value={item} sortIndex={index} />
          ))}
        </div>
      )
    });

    return (
      <div style={{ width: "100%" }}>
        <USlider label="Zoom start" min={0} max={this.props.storyboard.MaxTime} step={1}
          defaultValue={this.props.zoomRange[0]} onValueApplied={this.props.onZoomChange("start")} />
        <USlider label="Zoom end" min={0} max={this.props.storyboard.MaxTime} step={1}
          defaultValue={this.props.zoomRange[1]} onValueApplied={this.props.onZoomChange("end")} />
        <Divider />
        <SortableList axis="xy" lockAxis="xy" useDragHandle
          items={this.props.storyboard.Timelines} onSortEnd={this.onSortEnd} />
        <div style={{ display: "flex" }}>
          <Button style={{ margin: "10px" }} mini={true}
            variant="fab" onClick={this.mShowAll}>
            <Visibility />
          </Button>
          <Button style={{ margin: "10px" }} mini={true}
            variant="fab" onClick={this.mHideAll}>
            <VisibilityOff />
          </Button>
          <Button style={{ margin: "10px" }} mini={true} color="secondary"
            variant="fab" onClick={this.props.onWorkspaceApplied}>
            <Check />
          </Button>
        </div>
      </div>
    );
  }

  private mHideAll = () => {
    for (let i = 0; i < this.props.timelinesVisibility.length; i++) {
      this.props.timelinesVisibility[i] = false;
    }
    this.setState({});
  }
  private mShowAll = () => {
    for (let i = 0; i < this.props.timelinesVisibility.length; i++) {
      this.props.timelinesVisibility[i] = true;
    }
    this.setState({});
  }

  private onVisibilityChanged = (index: number) => (visible: boolean) => {
    this.props.timelinesVisibility[index] = visible;
    this.setState({});
  }
  private mMoveTimelineToTop = (prevIndex: number) => () => {
    this.onArrayMove(prevIndex, 0);
    this.setState({});
  }
  private mMoveTimelineToBottom = (prevIndex: number) => () => {
    const newIndex = this.props.storyboard.Timelines.length - 1;
    this.onArrayMove(prevIndex, newIndex)
    this.setState({});
  }
  private onSortEnd = (sort: SortEnd, event: SortEvent) => {
    this.onArrayMove(sort.oldIndex, sort.newIndex)
    this.setState({});
  };

  private onArrayMove(oldIndex: number, newIndex: number) {
    this.props.storyboard.Timelines = arrayMove(this.props.storyboard.Timelines, oldIndex, newIndex);
    const newArray = arrayMove(this.props.timelinesVisibility, oldIndex, newIndex);
    for (let i = 0; i < newArray.length; i++) {
      this.props.timelinesVisibility[i] = newArray[i];
    }
  }

}

export default UWorkspace;
