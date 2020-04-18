import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { connect } from 'react-redux';

import ColorPanel from "../../containers/ColorPanel/ColorPanelContainer";
import SidePanel from "../../containers/SidePannel/SidePannelContainer";
import Messages from "../../components/Messages/MessagesContainer";
import MetaPanel from "../../components/MetaPanel/MetaPanel";

import "../../components/App.css";

const Dashboard = ({ currentUser, currentChannel }) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel 
      key={currentUser && currentUser.uid}
      currentUser={currentUser}
    />
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id} 
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </Grid.Column>
    <GridColumn width={4}>
      <MetaPanel />
    </GridColumn>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps)(Dashboard);
