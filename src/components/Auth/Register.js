import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

import "./App.css";

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: ""
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    const { email, password } = this.state;
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(createdUSer => {
        console.log(createdUSer);
      });
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="register">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="blue" textAlign="center">
            <Icon name="id badge" color="blue"></Icon>
            Register for Devchat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                onChange={this.handleChange}
                value={username}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                type="email"
                onChange={this.handleChange}
                value={email}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={this.handleChange}
                value={password}
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={this.handleChange}
              />
              <Button color="blue" fluid size="large">
                Submit
              </Button>
              <Message>
                Already an user? <Link to="/login">Login</Link>
              </Message>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
