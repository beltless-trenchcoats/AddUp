import React, { Component } from 'react';
import axios from 'axios';
import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import logo from './logo.svg';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLoginModal: false,
      showSignupModal: false,
      showLogoutModal: false,
      username: '',
      password: ''
    }
    this.closeLogin = this.closeLogin.bind(this)
    this.openLogin = this.openLogin.bind(this)
    this.closeSignup = this.closeSignup.bind(this)
    this.openSignup = this.openSignup.bind(this)
    this.closeLogout = this.closeLogout.bind(this)
    this.openLogout = this.openLogout.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
    this.signupUser = this.signupUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onUsernameChange = this.onUsernameChange.bind(this)
  }

  closeLogin() {
    this.setState({ showLoginModal: false });
  }
  openLogin() {
    this.setState({ showLoginModal: true });
  }
  closeSignup() {
    this.setState({ showSignupModal: false });
  }
  openSignup() {
    this.setState({ showSignupModal: true });
  }
  closeLogout() {
    this.setState({ showLogoutModal: false });
  }
  openLogout() {
    this.setState({ showLogoutModal: true });
  }

  toggleModal () {
    this.setState({
      showSignupModal: !this.state.showSignupModal,
      showLoginModal: !this.state.showLoginModal
    })
  }

  signupUser (e) {
    e.preventDefault();
    axios.post('http://localhost:8080/signup', {
      username: this.state.username,
      password: this.state.password
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loginUser (e) {
    e.preventDefault();
    axios.post('http://localhost:8080/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  logoutUser () {
    this.close();
    //remove session
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value})
    console.log('password', this.state.password)
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value})
    console.log('username', this.state.username)
  }

  render() {
    return (
      <header>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="name">AddUp+</div>
          <Button className="loginButton" bsSize="small" onClick={this.openLogin}>Login</Button>
          <Button className="signupButton" bsSize="small" onClick={this.openSignup}>Sign Up</Button>
          <Button className="logoutButton" bsSize="small" onClick={this.openLogout}>Logout</Button>
        </div>


        {/*Signup Modal*/}
        <Modal className="modal" show={this.state.showSignupModal} onHide={this.closeSignup}>
          <Modal.Header closeButton>
            <Modal.Title>Create Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please provide a Username and Password to create your AddUp+ Account</p>

            <form onSubmit={this.signupUser}>
              <FieldGroup
                id="formControlsEmail"
                type="text"
                label="Username"
                placeholder="Enter username"
                onChange={this.onUsernameChange}
              />
              <FieldGroup
                id="formControlsPassword"
                label="Password"
                type="password"
                placeholder="Password"
                onChange={this.onPasswordChange}
              />
              <Button
                className="modalButton"
                type="submit"
                bsStyle="primary"
                >Signup
              </Button>
              <Button className="modalButton" onClick={this.closeSignup}>Cancel</Button>
            </form>

          </Modal.Body>
          <Modal.Footer>
            <p>Already have an account? <a onClick={this.toggleModal}>Click here</a> to log in</p>
          </Modal.Footer>
        </Modal>


        {/*Login Modal*/}
        <Modal className="modal" show={this.state.showLoginModal} onHide={this.closeLogin}>
          <Modal.Header closeButton>
            <Modal.Title>Login to your account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.loginUser}>
              <FieldGroup
                id="formControlsEmail"
                type="text"
                label="Username"
                placeholder="Enter username"
                onChange={this.onUsernameChange}
              />
              <FieldGroup
                id="formControlsPassword"
                label="Password"
                type="password"
                placeholder="Password"
                onChange={this.onPasswordChange}
              />
              <Button
                className="modalButton"
                type="submit"
                bsStyle="primary"
                >Login
              </Button>
              <Button className="modalButton" onClick={this.closeLogin}>Cancel</Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <p>Don't yet have an account? <a onClick={this.toggleModal}>Click here</a> to signup</p>
          </Modal.Footer>
        </Modal>


        {/*Logout Modal*/}
        <Modal className="modal" show={this.state.showLogoutModal} onHide={this.closeLogout}>
          <Modal.Header closeButton>
            <Modal.Title>Logout of current account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p> Would you like to logout?</p>
            <Button className="modalButton" bsStyle="primary" onClick={this.logoutUser}>Logout</Button>
            <Button className="modalButton" onClick={this.closeLogout}>Cancel</Button>
          </Modal.Body>
        </Modal>

        {this.props.children}
      </header>
    );
  }
}

export default Header;
