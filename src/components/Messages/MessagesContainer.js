import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import uuidv4 from "uuid/v4";

import Message from "./Message";
import MessageForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";

import "./style.css";

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
  progressBar: false,
  numUniqueUsers: "",
  searchTerm: "",
  searchLoading: false,
  searchResults: [],
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
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
      this.countUniqueUsers(loadedMessages);
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
    const { channel, messagesRef, storageRef, errors } = this.state;
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
            this.isProgressBarVisible(percentUploaded);
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

  isProgressBarVisible = (percent) => {
    if (percent > 0) {
      this.setState({
        progressBar: true,
      });
    }
  };

  displayChannelName = (channel) => (channel ? `#${channel.name}` : "");

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((accumulator, message) => {

      if (!accumulator.includes(message.user.name)) {
        accumulator.push(message.user.name);
      }
      return accumulator;
    }, []);
    const singleUser = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${singleUser ? "s" : ""}`;
    this.setState({
      numUniqueUsers,
    });
  };

  onSearch = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      () => this.filterMessages()
    );
  };

  filterMessages = () => {
    const { messages, searchTerm } = this.state;
    const channelMessages = [...messages];

    /* g modifier: global. All matches (don't return on first match)
      i modifier: insensitive. Case insensitive match (ignores case of [a-zA-Z])*/
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = channelMessages.reduce((accumulator, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        accumulator.push(message);
      }
      return accumulator;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false}), 1000)
  };

  render() {
    const {
      errors,
      message,
      loading,
      messages,
      modal,
      uploadState,
      percentUploaded,
      progressBar,
      channel,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          onSearch={this.onSearch}
          searchLoading={searchLoading}
        />
        <Segment>
          <Comment.Group
            className={progressBar ? "messages_progress" : "messages"}
          >
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
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
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Fragment>
    );
  }
}

export default Messages;
