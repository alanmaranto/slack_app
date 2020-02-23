import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";

import MessageForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";

class Messages extends Component {
  render() {
    return (
      <Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">Messages</Comment.Group>
        </Segment>
        <MessageForm />
      </Fragment>
    );
  }
}

export default Messages;
