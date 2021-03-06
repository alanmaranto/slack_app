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
  modal: false,
  firstLoad: true,
  activeChannel: ""
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

  componentWillUnmount() {
    this.removeListeners();
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
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    const { channelsRef } = this.state;
    channelsRef.off();
  };

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    const firstChannel = channels[0];
    if (firstLoad && channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  displayChannels = channels => {
    const { activeChannel } = this.state;
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => this.changeChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === activeChannel}
        >
          # {channel.name}
        </Menu.Item>
      ))
    );
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
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
