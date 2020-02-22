import React, { Component } from "react";
import firebase from "../../firebase";

import UserPanel from './UserPanel';

/* const initialState = {
  user: this.props.currentUser
}; */

class UserPanelContainer extends Component {
  state = {
    user: this.props.currentUser
  };
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
      <UserPanel user={user} dropdownOptions={this.dropdownOptions}/>
    );
  }
}

export default UserPanelContainer;
