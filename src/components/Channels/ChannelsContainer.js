import React, { Component, Fragment } from "react";
import { Menu } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions";
import AddChannelModal from "./AddChannelModal";
import Channels from "./Channels";

const initialState = {
  channels: [],
  channelName: "",
  channelDetails: "",
  channelsRef: firebase.database().ref("channels"),
  modal: false
};

class ChannelsContainer extends Component {
  constructor(props) {
    super(props);
    const defaultState = {
      ...initialState,
      user: this.props.currentUser
    };
    this.state = defaultState;
  }

  componentDidMount() {
    this.addListeners();
  }

  closeModal = () => {
    this.setState({
      modal: false
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  openModal = () => {
    this.setState({
      modal: true
    });
  };

  addListeners = () => {
    const { channelsRef } = this.state;
    let loadedChannels = [];
    channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      console.log(loadedChannels);
      this.setState({ channels: loadedChannels });
    });
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ));

  changeChannel = channel => {
    this.props.setCurrentChannel(channel);
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  onSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Channels
          channels={channels}
          openModal={this.openModal}
          displayChannels={this.displayChannels}
        />
        <AddChannelModal
          modal={modal}
          onChange={this.onChange}
          closeModal={this.closeModal}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel })(ChannelsContainer);
