import React, { Component } from 'react';
// import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import logo from './logo.svg';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // showLoginModal: false,
      // showSignupModal: false
    }
    // this.closeLogin = this.closeLogin.bind(this)
    // this.openLogin = this.openLogin.bind(this)
    // this.closeSignup = this.closeSignup.bind(this)
    // this.openSignup = this.openSignup.bind(this)
  } 

  // closeLogin() {
  //   // this.setState({ showLoginModal: false });
  // }
  // openLogin() {
  //   this.setState({ showLoginModal: true });
  // }
  // // closeSignup() {
  // //   this.setState({ showSignupModal: false });
  // // }
  // // openSignup() {
  // //   this.setState({ showSignupModal: true });
  // // }


  render() {
    return (
      <header>
        <SignupModal ref="child" />

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="name">AddUp+</div>
          <Button className="loginButton" bsSize="small" onClick={LoginModal.open}>Login</Button>
          <Button className="signupButton" bsSize="small" onClick={this.refs.child.open}>Sign Up</Button>
          <Button className="logoutButton" bsSize="small">Logout</Button>
        </div>

        {this.props.children}
      </header>
    );
  }
}

export default Header;