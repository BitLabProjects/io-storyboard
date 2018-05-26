import * as React from 'react';

import './App.css';
import UStoryboard from './UStoryboard';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

class App extends React.Component {
  public render() {
    return (
      <div>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
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
}

export default App;