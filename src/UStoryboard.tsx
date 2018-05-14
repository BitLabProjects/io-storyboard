import * as React from 'react';

import UTimeline from './UTimeline';

import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import Button from 'material-ui/Button';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
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
    const timelines = this.state.storyboard.Timelines.map((tl) => {
      return (
        <ExpansionPanel key={tl.OutputId}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{tl.Name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <UTimeline timeline={tl} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });

    const that = this;
    return (
      <div style={{ marginLeft: "25px", marginRight: "25px" }}>
        {timelines}
        <Button style={{ margin: "25px" }}
          color="primary"
          variant="fab"
          onClick={this.addTimeline.bind(that)}>
          <AddIcon />
        </Button>
        <Button style={{ margin: "25px" }}
          variant="fab"
          onClick={this.exportStoryboard.bind(that)}>
          <ImportExportIcon />
        </Button>
      </div>
    );
  }

  private addTimeline() {
    this.setState((prevState) => {
      prevState.storyboard.AddTimeline();
      return prevState;
    });
  }

  private exportStoryboard() {
    alert(this.state.storyboard.ExportToJson());
  }


}

export default UStoryboard;