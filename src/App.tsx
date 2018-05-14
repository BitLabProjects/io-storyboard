import * as React from 'react';

import './App.css';
import UStoryboard from './UStoryboard';

import MenuIcon from '@material-ui/icons/Menu';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

class App extends React.Component {
  public render() {
    return (
      <div>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" >storyboard.io</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: "100px" }}>
          <UStoryboard />
        </div>
      </div>
    );
  }
}

export default App;