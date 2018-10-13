import * as React from 'react';

import {Typography} from '@material-ui/core';


class UDashboardState {
  
}
class UDashboard extends React.Component<any, UDashboardState> {  

  public render() {  

    return (
      <div style={{ marginLeft: "5px", marginRight: "5px" }}>
        <Typography style={{margin: "40px 0"}} variant="title" >Dashboard mode</Typography>        
      </div>
    );
  }

}

export default UDashboard;