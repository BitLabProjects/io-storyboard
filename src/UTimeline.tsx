import Button from "@material-ui/core/Button";
import * as React from "react";
import { CTimeline, CTimelineEntry, EOutputType } from "./CTimeline";
import UTimelineEntry from "./UTimelineEntry";

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SortIcon from '@material-ui/icons/Sort';

import { Dialog, DialogActions, DialogContent, DialogContentText, Grid, MenuItem, Paper, TextField } from "@material-ui/core";

import { arrayMove, SortableContainer, SortableElement, SortableHandle, SortEnd, SortEvent } from "react-sortable-hoc";
import BStyles from "./BStyles";


class CTimelineProps {
  public timeline: CTimeline
  public onRemove: (key: number) => void;
  public onUpdate: () => void;
}
class CTimelineState {
  public timeline: CTimeline;
  public entryKeyToAdd: number;
  public entryKeyToRemove: number;
  public removeDialogOpen: boolean;
}
class UTimeline extends React.Component<CTimelineProps, CTimelineState> {

  private thisInstance: UTimeline;

  constructor(props: CTimelineProps) {
    super(props);
    this.thisInstance = this;
    this.state = {
      timeline: props.timeline,
      entryKeyToAdd: -1,
      entryKeyToRemove: -1,
      removeDialogOpen: false
    };
  }

  public render() {

    const DragHandle = SortableHandle(() => <SortIcon />);

    const SortableItem = SortableElement<{ value: CTimelineEntry }>(({ value }) =>
      <Paper style={{ margin: "5px", padding: "15px" }} >
        <Grid container={true} alignItems="center">
          <Grid item={true} >
            <UTimelineEntry
              entry={value}
              removeEntry={this.removeEntry.bind(this.thisInstance)}
              outputType={this.state.timeline.OutputType} />
          </Grid>
          <Grid item={true} >
            <DragHandle />
          </Grid>
        </Grid>
      </Paper>
    );
    const SortableList = SortableContainer<{ items: CTimelineEntry[] }>(({ items }) => {
      return (
        <div>
          {items.map((item, index) => (
            <SortableItem key={item.Key} index={index} value={item} />
          ))}
        </div>
      )
    });

    // const entries = this.state.timeline.Entries.map((entry) => {
    //   return (
    //     <Grow key={entry.Key}
    //       in={this.state.entryKeyToRemove !== entry.Key}
    //       onExited={this.removeEntry.bind(this.thisInstance)}>
    //       <Paper style={{ margin: "5px", padding: "15px" }} >
    //         <UTimelineEntry
    //           entry={entry}
    //           removeEntry={this.animateEntryRemoving.bind(this.thisInstance)}
    //           outputType={this.state.timeline.OutputType} />
    //       </Paper>
    //     </Grow>
    //   );
    // });

    const removeDialog = (
      <Dialog
        open={this.state.removeDialogOpen}
        onClose={this.closeRemoveConfirmDialog.bind(this.thisInstance)} >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the whole timeline?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.remove.bind(this.thisInstance)}>Remove timeline</Button>
        </DialogActions>
      </Dialog>);

    return (
      <div>
        <TextField
          id="time"
          label="Name"
          placeholder="Name"
          value={this.state.timeline.Name}
          onChange={this.onFieldChanged('name')}
          margin="normal"
          style={BStyles.TextFieldStyle} />
        <TextField
          id="outputId"
          label="Output"
          placeholder="Output"
          value={this.state.timeline.OutputId}
          onChange={this.onFieldChanged('output')}
          type="number"
          margin="normal"
          style={BStyles.TextFieldStyle} />
        <TextField
          id="outputType"
          label="Output Type"
          placeholder="Output Type"
          value={this.state.timeline.OutputType}
          onChange={this.onFieldChanged('outputType')}
          select={true}
          margin="normal"
          style={BStyles.TextFieldStyle}>
          <MenuItem key={EOutputType.Analog} value={EOutputType.Analog}>Analog</MenuItem>
          <MenuItem key={EOutputType.Digital} value={EOutputType.Digital}>Digital</MenuItem>
        </TextField>
        <Button style={{ margin: "10px" }}
          mini={true}
          variant="fab"
          onClick={this.openRemoveConfirmDialog.bind(this.thisInstance)}>
          <RemoveIcon />
        </Button>
        {removeDialog}
        <SortableList
          useDragHandle={true} lockAxis="y"
          items={this.state.timeline.Entries}
          onSortEnd={this.onSortEnd.bind(this.thisInstance)} />
        {/* {entries} */}
        <div>
          <Button style={{ margin: "10px" }}
            variant="fab"
            onClick={this.addEntry.bind(this.thisInstance)}>
            <AddIcon />
          </Button>
        </div>
      </div >
    );
  }

  private addEntry() {
    const newEntry = this.state.timeline.AddEntry(0, 0);
    this.setState({ entryKeyToAdd: newEntry.Key });
  }

  // launch remove animation, onExit event will raise removeEntry
  // private animateEntryRemoving(key: number) {
  //   this.setState({ entryKeyToRemove: key });
  // }

  // removeEntry for real
  private removeEntry(key: number) {
    // this.state.timeline.RemoveEntry(this.state.entryKeyToRemove);
    this.state.timeline.RemoveEntry(key);
    // reset key to remove
    this.setState({ entryKeyToRemove: -1 });
  }

  private openRemoveConfirmDialog() {
    this.setState({ removeDialogOpen: true });
  }
  private closeRemoveConfirmDialog() {
    this.setState({ removeDialogOpen: false });
  }

  private remove() {
    this.closeRemoveConfirmDialog();
    this.props.onRemove(this.state.timeline.Key);
  }

  private onFieldChanged(fieldName: string) {
    return ((e: any) => {
      const newValue = e.target.value;
      switch (fieldName) {
        case 'name': this.state.timeline.Name = newValue; break;
        case 'output': this.state.timeline.OutputId = +newValue; break;
        case 'outputType': this.state.timeline.OutputType = +newValue; break;
      }
      this.props.onUpdate();
      this.forceUpdate();
    });
  }

  private onSortEnd(sort: SortEnd, event: SortEvent) {
    this.state.timeline.Entries = arrayMove(this.state.timeline.Entries, sort.oldIndex, sort.newIndex);
    this.forceUpdate();
  }

}

export default UTimeline;
