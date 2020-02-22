import React, { Component, Fragment } from "react";
import firebase from '../../firebase';
import AddChannelModal from "./AddChannelModal";
import Channels from './Channels'

const initialState = {
  channels: [],
  channelName: '',
  channelDetails: '',
  channelsRef: firebase.database().ref('channels'),
  modal: false,
};

class ChannelsContainer extends Component {
  constructor(props) {
    super(props);
    const defaultState = {
      ...initialState,
      user: this.props.currentUser,
    }
    this.state = defaultState;
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

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      }
    }

    channelsRef.child(key).update(newChannel).then(() => {
      this.setState({ channelName: '', channelDetails: '' });
      this.closeModal();
      console.log('channel added');
    })
    .catch(err => {
      console.error(err)
    })
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails

  onSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel()
    }
  }

  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Channels channels={channels} openModal={this.openModal} />
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

export default ChannelsContainer;
