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
import md5 from "md5";
import firebase from "../../firebase";

import "./App.css";

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  errors: [],
  loading: false,
  usersRef: firebase.database().ref("users")
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

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = e => {
    const { email, password, errors, username } = this.state;
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUSer => {
          createdUSer.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUSer.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUSer).then(() => {
              });
            })
            .catch(err => {
              console.error(err);
              this.setState({ errors: errors.concat(err), loading: false });
            });
        })
        .catch(err => {
          console.error(err);
          this.setState({ errors: errors.concat(err), loading: false });
        });
    }
  };

  saveUser = createdUser => {
    const { usersRef } = this.state;
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="register">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="blue" textAlign="center">
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
                className={this.handleInputError(errors, "email")}
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
                className={this.handleInputError(errors, "password")}
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
                className={this.handleInputError(errors, "password")}
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="blue"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already an user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
