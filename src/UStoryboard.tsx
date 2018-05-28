import * as React from 'react';

import UTimeline from './UTimeline';

import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Typography from '@material-ui/core/Typography';
import CStoryboard from './CStoryboard';

class UStoryboardState {
  public storyboard: CStoryboard;
}
class UStoryboard extends React.Component<any, UStoryboardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      storyboard: CStoryboard.CreateFromJson("")
    };
  }

  public render() {
    const that = this;

    const timelines = this.state.storyboard.Timelines.map((tl) => {
      return (
        <ExpansionPanel key={tl.Key}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
        {timelines}
        <Button style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="primary"
          variant="fab"
          onClick={this.addTimeline.bind(that)}>
          <AddIcon />
        </Button>
        <Button style={{ position: "fixed", bottom: "80px", right: "10px" }}
          variant="fab"
          onClick={this.exportStoryboard.bind(that)}>
          <ImportExportIcon />
        </Button>
      </div>
    );
  }

  private addTimeline() {
    this.state.storyboard.AddTimeline();
    this.forceUpdate();
  }

  private removeTimeline(key: number) {
    this.state.storyboard.RemoveTimeline(key);
    this.forceUpdate();
  }

  private onUpdate() {
    this.forceUpdate();
  }

  private exportStoryboard() {    
    const text= this.state.storyboard.ExportToJson();
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