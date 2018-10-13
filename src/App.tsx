import * as React from 'react';

import './App.css';
import UDashboard from './UDashboard';
import UStoryboard from './UStoryboard';

import {
  AppBar, Dialog, DialogContent, DialogContentText,
  Divider, Drawer, IconButton, List,
  ListItem, ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import {
  DashboardOutlined, InfoOutlined,
  MenuOutlined, TimelineOutlined
} from '@material-ui/icons';

enum EAppPage {
  StoryboardModePage,
  DashboardPage
}

class AppState {
  public mainMenuOpen: boolean;
  public aboutDialogOpen: boolean;
  public currentPage: EAppPage;
}

class App extends React.Component<any, AppState> {

  private mTheme = createMuiTheme({
    palette: {      
    }
  });

  constructor(props: any) {
    super(props);
    this.state = {
      mainMenuOpen: false,
      aboutDialogOpen: false,
      currentPage: EAppPage.StoryboardModePage
    };
  }

  public render() {


    const d = new Date(2018, 10, 13, 14, 0);
    // yyyy.MM.dd.HHmm
    const formatDate = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}.${d.getHours()}${d.getMinutes()}`
    const aboutDialog = (
      <Dialog
        open={this.state.aboutDialogOpen}
        onClose={this.closeAboutDialog} >
        <DialogContent>
          <DialogContentText>
            io.storyboard [Pumping up your Outputs]<br />
            Developed with &#9829; by bitLab<br /><br />
            build {formatDate}
          </DialogContentText>
        </DialogContent>
      </Dialog>);

    const mainMenu = (
      <Drawer open={this.state.mainMenuOpen} onClose={this.closeMainMenu} >
        <List>
          <ListItem button onClick={this.setAppPage("storyboardMode")}>
            <ListItemIcon>
              <TimelineOutlined />
            </ListItemIcon>
            <ListItemText primary="Storyboard" />
          </ListItem>
          <ListItem button onClick={this.setAppPage("dashboardMode")}>
            <ListItemIcon>
              <DashboardOutlined />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.openAboutDialog} >
            <ListItemIcon>
              <InfoOutlined />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>);

    return (
      <MuiThemeProvider theme={this.mTheme}>
        {mainMenu}
        {aboutDialog}
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={this.openMainMenu}>
              <MenuOutlined />
            </IconButton>
            <Typography variant="title" color="inherit" >io.storyboard</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: "100px" }}>
          {this.state.currentPage === EAppPage.StoryboardModePage &&
            <UStoryboard />
          }
          {this.state.currentPage === EAppPage.DashboardPage &&
            <UDashboard />
          }
        </div>
      </MuiThemeProvider>
    );
  }

  private openAboutDialog = () => {
    this.setState({ aboutDialogOpen: true });
  }
  private closeAboutDialog = () => {
    this.setState({ aboutDialogOpen: false });
  }

  private openMainMenu = () => {
    this.setState({ mainMenuOpen: true });
  }
  private closeMainMenu = () => {
    this.setState({ mainMenuOpen: false });
  }

  private setAppPage = (page: string) => () => {
    switch (page) {
      case "storyboardMode": this.setState({ currentPage: EAppPage.StoryboardModePage }); break;
      case "dashboardMode": this.setState({ currentPage: EAppPage.DashboardPage }); break;
    }
  }

}

export default App;