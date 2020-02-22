import React, { Component, Fragment } from "react";
import AddChannelModal from "./AddChannelModal";
import Channels from './Channels'

const initialState = {
  channels: [],
  modal: false,
};

class ChannelsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
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

  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Channels channels={channels} openModal={this.openModal} />
        <AddChannelModal 
          modal={modal} 
          onChange={this.onChange}
          closeModal={this.closeModal}
        />
      </Fragment>
    );
  }
}

export default ChannelsContainer;
