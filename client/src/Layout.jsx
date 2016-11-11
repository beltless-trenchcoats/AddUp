import React, { Component } from 'react';
import { Link } from 'react-router';
// import { Button, Jumbotron, Col, Panel } from 'react-bootstrap';

import logo from './logo.svg';

class Layout extends Component {
  render() {
    return (
      <header>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="name">AddUp+</div>
          <span className="loginButton">Login</span>
          <span className="signupButton">SignUp</span>
        </div>
      </header>
    );
  }
}

export default Layout;
