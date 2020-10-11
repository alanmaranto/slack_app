import React from "react";
import { Menu, Icon } from "semantic-ui-react";

const DirectMessages = ({ users, isUserOnline }) => {
  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {/* Users to Send Direct Messages */}
      {users.map((user) => (
        <Menu.Item
          key={user.id}
          onClick={() => console.log(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
        >
          <Icon
            name="circle"
            color={isUserOnline(user) ? "green" : "red"}
          />
          @ {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
