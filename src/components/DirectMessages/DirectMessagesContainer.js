import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

const initialState = {
  users: [],
};

class DirectMessagesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  state = {};
  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {/* Users to Send Direct Messages */}
      </Menu.Menu>
    );
  }
}

export default DirectMessagesContainer;
