import React, { Component } from "react";
import ReactDOM from "react-dom";
import Dashboard from "./views/Dashboard/Dashboard";
import registerServiceWorker from "./registerServiceWorker";
import firebase from "./firebase";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducers";
import { setUser, clearUser } from "./redux/actions";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Spinner from './core/Spinner/Spinner';

import "semantic-ui-css/semantic.min.css";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
      }
    });
  }
  render() {
    const { isLoading } = this.props;
    return isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateFromProps = state  => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps, 
    { setUser, clearUser }
  )(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
