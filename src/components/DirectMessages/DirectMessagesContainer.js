import React, { Component } from "react";
import DirectMessages from "./DirectMessages";
import firebase from "../../firebase";

class DirectMessagesContainer extends Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  };

  componentDidMount() {
    const { user } = this.state;
    if (user) {
      this.addListeners(user.uid);
    }
  }

  addListeners = (currentUserUid) => {
    const { connectedRef, usersRef, presenceRef } = this.state;
    let loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user.uid = snap.key;
        user.status = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        //add status to user
        this.addStatusToUser(snap.key);
      }
    });
    presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const { users } = this.state;
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user.status = `${connected ? "online" : "offline"}`;
      }

      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user) => user.status === "online";

  render() {
    const { users } = this.state;
    return <DirectMessages users={users} isUserOnline={this.isUserOnline} />;
  }
}

export default DirectMessagesContainer;
