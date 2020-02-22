import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

const initialState = {
  channels: []
};

class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  render() {
    const { channels } = this.state;
    return (
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span> {" "}
          ({ channels. length }) <Icon name="add" />
        </Menu.Item>
        {/* Channels */}
      </Menu.Menu>
    );
  }
}

export default Channels;
