import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

const UserPanel = ({ user, dropdownOptions }) => {
  return (
    <Grid style={{ background: "#<Header" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
          {/* User Dropdown */}
          <Header style={{ padding: "0.2em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
