import React, { Component } from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

/* const initialState = {
  user: this.props.currentUser
}; */

class UserPanel extends Component {
    state = {
        user: this.props.currentUser
    }
/*   constructor(props) {
    super(props);
    this.state = initialState;
  } */

  dropdownOptions = () => {
      const { user } = this.state;
    return [
      {
        key: "user",
        text: (
          <span>
      Signed in as <strong>{user.displayName}</strong>
          </span>
        ),
        disabled: true
      },
      {
        key: "avatar",
        text: <span>Change Avatar</span>
      },
      {
        key: "signout",
        text: <span onClick={this.onSignOut}>Sign out</span>
      }
    ];
  };

  onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };

  render() {
      const { user } = this.state;
    console.log(this.props.currentUser);
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          {/* User Dropdown */}
          <Header style={{ padding: "0.2em" }} as="h4" inverted>
            <Dropdown
              trigger={<span>{user.displayName}</span>}
              options={this.dropdownOptions()}
            ></Dropdown>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default UserPanel;
