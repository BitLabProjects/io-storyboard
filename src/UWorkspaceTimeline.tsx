import * as React from "react";
import { CTimeline } from "./CTimeline";

import { VerticalAlignBottom, VerticalAlignTop, Visibility, VisibilityOff } from '@material-ui/icons';
import { Typography, IconButton, Checkbox, Paper } from "@material-ui/core";

interface IWorkspaceTimelineProps {
  timeline: CTimeline;
  visible: boolean;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
  onVisibilityChanged: (visible: boolean) => void;
}
class UWorkspaceTimeline extends React.Component<IWorkspaceTimelineProps, {}> {

  public render() {
    return (
      <Paper style={{ width: "230px" }} >
        <div style={{ display: "flex", alignItems: "center" }} >
          <IconButton onClick={this.props.onMoveToBottom}>
            <VerticalAlignBottom fontSize="small" />
          </IconButton>
          <IconButton onClick={this.props.onMoveToTop}>
            <VerticalAlignTop fontSize="small" />
          </IconButton>
          <Checkbox icon={<VisibilityOff fontSize="small" />} checkedIcon={<Visibility fontSize="small" />}
            checked={this.props.visible} onChange={this.onVisibilityChanged} />
          <Typography>{this.props.timeline.Name}</Typography>
        </div>
      </Paper>
    );
  }

  private onVisibilityChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.onVisibilityChanged(checked);
  }

}

export default UWorkspaceTimeline;
