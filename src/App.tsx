import * as React from 'react';

import './App.css';
import UStoryboard from './UStoryboard';

import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

class AppState {
  public removeDialogOpen: boolean;
}

class App extends React.Component<any, AppState> {

  private thisInstance: App;

  constructor(props: any) {
    super(props);
    this.thisInstance = this;
    this.state = { removeDialogOpen: false };
  }

  public render() {
    const d = new Date();
    // yyyy.MM.dd.HHmm
    const formatDate = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}.${d.getHours()}${d.getMinutes()}`
    const removeDialog = (
      <Dialog
        open={this.state.removeDialogOpen}
        onClose={this.closeRemoveConfirmDialog.bind(this.thisInstance)} >
        <DialogContent>
          <DialogContentText>
            io.storyboard [Pumping up your Outputs]<br />
            Developed with &#9829; by bitLab<br /><br />
            build {formatDate}
          </DialogContentText>
        </DialogContent>
      </Dialog>);

    return (
      <div>
        {removeDialog}
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={this.openRemoveConfirmDialog.bind(this.thisInstance)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" >io.storyboard</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: "100px" }}>
          <UStoryboard />
        </div>
      </div>
    );
  }

  private openRemoveConfirmDialog() {
    this.setState({ removeDialogOpen: true });
  }
  private closeRemoveConfirmDialog() {
    this.setState({ removeDialogOpen: false });
  }

}

export default App;