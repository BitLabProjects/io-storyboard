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
import CStoryboard, { IStoryboardJson } from './CStoryboard';
import BStoryboard from './BStoryboard';

enum EAppPage {
  StoryboardModePage,
  DashboardPage
}

interface IAppState {
  mainMenuOpen: boolean;
  aboutDialogOpen: boolean;
  currentPage: EAppPage;
  storyboard: CStoryboard;
}

class App extends React.Component<any, IAppState> {

  private mTheme = createMuiTheme({
    palette: {
    }
  });

  constructor(props: any) {
    super(props);
    this.state = {
      mainMenuOpen: false,
      aboutDialogOpen: false,
      currentPage: EAppPage.DashboardPage,
      storyboard: CStoryboard.CreateFromJson(BStoryboard.GetStoryboard0())
    };

    // prevent page leave
    window.onbeforeunload = () => {
      return "";
    }

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
          <Toolbar disableGutters>
            <IconButton color="inherit" aria-label="Menu" onClick={this.openMainMenu}>
              <MenuOutlined />
            </IconButton>
            <Typography style={{ margin: "0px 20px" }} variant="h6" color="inherit" >io.storyboard</Typography>
            <Typography style={{ margin: "0px 20px" }} variant="subtitle1" color="inherit" >
              [{this.state.currentPage === EAppPage.StoryboardModePage ? "edit" : "dashboard"}]
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: "64px" }}>
          {this.state.currentPage === EAppPage.StoryboardModePage &&
            <UStoryboard storyboard={this.state.storyboard}
              onOpenLocalStoryboard={this.onOpenLocalStoryboard} />
          }
          {this.state.currentPage === EAppPage.DashboardPage &&
            <UDashboard storyboard={this.state.storyboard} />
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

  private onOpenLocalStoryboard = (sb: IStoryboardJson) => {
    this.setState({ storyboard: CStoryboard.CreateFromJson(sb) });
  }

  private setAppPage = (page: string) => () => {
    switch (page) {
      case "storyboardMode": {
        this.setState({ mainMenuOpen: false, currentPage: EAppPage.StoryboardModePage }); break;
      }
      case "dashboardMode": {
        this.setState({ mainMenuOpen: false, currentPage: EAppPage.DashboardPage }); break;
      }
    }
  }

}

export default App;