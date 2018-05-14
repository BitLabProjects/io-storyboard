import Button from "material-ui/Button";
import * as React from "react";
import { CTimeline } from "./CTimeline";
import UTimelineEntry from "./UTimelineEntry";

import AddIcon from '@material-ui/icons/Add';
import { Paper } from "material-ui";

class CTimelineProps {
  public timeline: CTimeline
}
class CTimelineState {
  public timeline: CTimeline
}
class UTimeline extends React.Component<CTimelineProps, CTimelineState> {

  private thisInstance: UTimeline;

  constructor(props: CTimelineProps) {
    super(props);
    this.thisInstance = this;
    this.state = { timeline: props.timeline };
  }

  public render() {
    const entries = this.state.timeline.Entries.map((entry) => {
      return (
        <Paper key={entry.Key} style={{ margin: "10px", padding: "15px" }} >
          <UTimelineEntry entry={entry} removeEntry={this.removeEntry.bind(this.thisInstance)} />
        </Paper>
      );
    });   

    return (
      <div>
        {entries}
        <Button style={{ margin: "25px" }}
          variant="fab"
          onClick={this.addEntry.bind(this.thisInstance)}>
          <AddIcon />
        </Button>
      </div>
    );
  }

  private addEntry() {
    this.setState((prevState) => {
      prevState.timeline.AddEntry(0, 0);
      return prevState;
    });
  }

  private removeEntry(key: number) {    
    this.setState((prevState) => {      
      prevState.timeline.RemoveEntry(key);
      return prevState;
    });
  }

}

export default UTimeline;
