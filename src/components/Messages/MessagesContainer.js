import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import uuidv4 from "uuid/v4";

import Message from "./Message";
import MessageForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";

const initialState = {
  message: "",
  messages: [],
  messagesLoading: true,
  loading: false,
  errors: [],
  messagesRef: firebase.database().ref("messages"),
  modal: false,
  uploadState: "",
  uploadTask: null,
  storageRef: firebase.storage().ref(),
  percentUploaded: 0,
};

class Messages extends Component {
  constructor(props) {
    super(props);
    const reduxState = {
      ...initialState,
      channel: this.props.currentChannel,
      user: this.props.currentUser,
    };
    this.state = reduxState;
  }

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      console.log(loadedMessages);
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = (fileUrl = null) => {
    const { message, user } = this.state;
    const data = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
    };
    if (fileUrl !== null) {
      data["image"] = fileUrl;
    } else {
      data["content"] = message;
    }
    console.log("CreateMessage, data", data);
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
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            errors: errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: errors.concat({ message: "Add a message" }),
      });
    }
  };

  displayMessages = (messages) => {
    const { user } = this.state;
    return (
      messages.length > 0 &&
      messages.map((message) => (
        <Message key={message.timestamp} message={message} user={user} />
      ))
    );
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  //nested callbacks

  uploadFile = (file, metadata) => {
    const { channel, messagesRef, storageRef, uploadTask, errors } = this.state;
    const pathToUpload = channel.id;
    const ref = messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    const { errors } = this.state;

    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          errors: errors.concat(err),
        });
      });
  };

  render() {
    const { errors, message, loading, messages, modal } = this.state;
    return (
      <Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          message={message}
          loading={loading}
          modal={modal}
          errors={errors}
          onChange={this.onChange}
          sendMessage={this.sendMessage}
          openModal={this.openModal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
      </Fragment>
    );
  }
}

export default Messages;
