import React from "react";
import { Menu, Icon } from "semantic-ui-react";

const Channels = ({ channels, openModal, displayChannels }) => {
  return (
    <Menu.Menu style={{ paddingBottom: "2em" }}>
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span>{" "}
        ({channels.length}) <Icon name="add" onClick={openModal} />
      </Menu.Item>
      {displayChannels(channels)}
    </Menu.Menu>
  );
};

export default Channels;
