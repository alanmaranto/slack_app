import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";

import ColorPanel from "../../components/ColorPanel/ColorPanel";
import SidePanel from "../../components/SidePanel/SidePanel";
import Messages from "../../components/Messages/Messages";
import MetaPanel from "../../components/MetaPanel/MetaPanel";

import "../../App.css";

const Dashboard = () => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel />
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>
    <GridColumn width={4}>
      <MetaPanel />
    </GridColumn>
  </Grid>
);

export default Dashboard;
