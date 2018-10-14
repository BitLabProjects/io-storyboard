import * as React from 'react';

import UTimeline from './UTimeline';

import {Add, ExpandMore, ImportExport} from '@material-ui/icons';

import { ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Typography from '@material-ui/core/Typography';
import CStoryboard from './CStoryboard';

class UStoryboardProps {
  public storyboard: CStoryboard;
}

class UStoryboardState {  
}
class UStoryboard extends React.Component<UStoryboardProps, UStoryboardState> {
  constructor(props: UStoryboardProps) {
    super(props);    
  }

  public render() {
    const that = this;

    const timelines = this.props.storyboard.Timelines.map((tl) => {
      return (
        <ExpansionPanel key={tl.Key}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography>{tl.Name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <UTimeline
              timeline={tl}
              onUpdate={this.onUpdate.bind(that)}
              onRemove={this.removeTimeline.bind(that)} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });

    return (
      <div style={{ marginLeft: "5px", marginRight: "5px" }}>
        <Typography style={{margin: "40px 0"}} variant="h6" >Storyboard mode</Typography>
        {timelines}
        <Button style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="primary"
          variant="fab"
          onClick={this.addTimeline.bind(that)}>
          <Add />
        </Button>
        <Button style={{ position: "fixed", bottom: "80px", right: "10px" }}
          variant="fab"
          onClick={this.exportStoryboard.bind(that)}>
          <ImportExport />
        </Button>
      </div>
    );
  }

  private addTimeline() {
    this.props.storyboard.AddTimeline();
    this.forceUpdate();
  }

  private removeTimeline(key: number) {
    this.props.storyboard.RemoveTimeline(key);
    this.forceUpdate();
  }

  private onUpdate() {
    this.forceUpdate();
  }

  private exportStoryboard() {
    const text = this.props.storyboard.ExportToJson();
    // download file json
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "timeline.json");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }


}

export default UStoryboard;