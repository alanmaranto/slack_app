import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessageForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";

const initialState = {
  message: "",
  loading: false,
  errors: [],
  messagesRef: firebase.database().ref("messages")
};

class Messages extends Component {
  constructor(props) {
    super(props);
    const reduxState = {
      ...initialState,
      channel: this.props.currentChannel,
      user: this.props.currentUser
    };
    this.state = reduxState;
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = () => {
    const { message, user } = this.state;
    const data = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      },
      content: message
    };
    return data;
  };

  sendMessage = () => {
    const { messagesRef, message, channel, errors } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
            errors: errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: errors.concat({ message: "Add a message" })
      });
    }
  };

  render() {
    const { errors, message, loading } = this.state;
    return (
      <Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">Messages</Comment.Group>
        </Segment>
        <MessageForm
          message={message}
          loading={loading}
          errors={errors}
          sendMessage={this.sendMessage}
          onChange={this.onChange}
        />
      </Fragment>
    );
  }
}

export default Messages;
