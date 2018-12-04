import * as React from 'react';

import UTimeline from './UTimeline';

import { Add, Save, ExpandMore, OpenInBrowser } from '@material-ui/icons';

import Button from '@material-ui/core/Button';
import CStoryboard, { IStoryboardJson } from './CStoryboard';
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

import UWorkspace from './UWorkspace';
import BStoryboard from './BStoryboard';

interface IStoryboardProps {
  storyboard: CStoryboard;
  onOpenLocalStoryboard: (sb: IStoryboardJson) => void;
}

interface IStoryboardState {
  zoomRange: [number, number];
  timelinesVisibility: boolean[];
}
// Inheriting from PureComponent, so Render is triggered only by shallow comparison
class UStoryboard extends React.PureComponent<IStoryboardProps, IStoryboardState> {

  constructor(props: IStoryboardProps) {
    super(props);
    this.state = {
      zoomRange: [0, this.props.storyboard.MaxTime + 1],
      timelinesVisibility: Array<boolean>(this.props.storyboard.Timelines.length).fill(true)
    };
  }

  public render() {
    const timelines: JSX.Element[] = [];

    for (let i = 0; i < this.props.storyboard.Timelines.length; i++) {
      const tl = this.props.storyboard.Timelines[i];
      if (this.state.timelinesVisibility[i]) {
        timelines.push(
          <UTimeline key={tl.key}
            onUpdate={this.onUpdate}
            timeline={tl}
            zoomRange={this.state.zoomRange}
            onRemove={this.removeTimeline} />
        );
      }
    }

    return (
      <div style={{ margin: "0px 5px" }}>
        <Typography style={{ margin: "10px", fontStyle: "italic" }} >All time values are expressed in seconds</Typography>
        <ExpansionPanel style={{ margin: "10px" }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography>Workspace</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <UWorkspace storyboard={this.props.storyboard}
              zoomRange={this.state.zoomRange}
              timelinesVisibility={this.state.timelinesVisibility}
              onZoomChange={this.onZoomChange}
              onWorkspaceApplied={this.onWorkspaceApplied}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {timelines}
        <Button style={{ position: "fixed", bottom: "150px", right: "10px" }}
          variant="fab"
          onClick={this.openLocalStoryboard}>
          <OpenInBrowser />
        </Button>
        <Button style={{ position: "fixed", bottom: "80px", right: "10px" }}
          variant="fab"
          onClick={this.exportStoryboard}>
          <Save />
        </Button>
        < Button style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="primary"
          variant="fab"
          onClick={this.addTimeline}>
          <Add />
        </Button>
      </div >
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

  private onWorkspaceApplied = () => {
    this.onUpdate();
  }

  private addTimeline = () => {
    this.props.storyboard.AddTimeline();
    this.setState({
      timelinesVisibility: [...this.state.timelinesVisibility].concat(true)
    });
  };

  private removeTimeline = (key: number) => {
    this.props.storyboard.RemoveTimeline(key);
    const tlCount = this.state.timelinesVisibility.length;
    this.state.timelinesVisibility.splice(tlCount - 1, 1);
    this.setState({
      timelinesVisibility: [...this.state.timelinesVisibility].concat()
    });
  };

  private onUpdate = () => {
    this.forceUpdate();
  }

  private openLocalStoryboard = async () => {
    this.props.onOpenLocalStoryboard(await BStoryboard.GetLocalStoryboard())
  }

  private exportStoryboard = () => {
    const text = JSON.stringify(this.props.storyboard.ExportToJson());
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