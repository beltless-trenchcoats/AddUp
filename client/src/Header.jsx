import React, { Component } from 'react';
// import { Link } from 'react-router';
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
      showLogoutModal: false
    }
    this.closeLogin = this.closeLogin.bind(this)
    this.openLogin = this.openLogin.bind(this)
    this.closeSignup = this.closeSignup.bind(this)
    this.openSignup = this.openSignup.bind(this)
    this.closeLogout = this.closeLogout.bind(this)
    this.openLogout = this.openLogout.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
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

  signupUser () {

  }

  loginUser () {

  }

  logoutUser () {
    this.close();
    //remove session
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
            
            <form>
              <FieldGroup
                id="formControlsEmail"
                type="email"
                label="Email address"
                placeholder="Enter email"
              />
              <FieldGroup
                id="formControlsPassword"
                label="Password"
                type="password"
                placeholder="Password"
              />
              <Button 
                className="modalButton"
                type="submit" 
                bsStyle="primary" 
                onClick={this.signupUser}
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
            <form>
              <FieldGroup
                id="formControlsEmail"
                type="email"
                label="Email address"
                placeholder="Enter email"
              />
              <FieldGroup
                id="formControlsPassword"
                label="Password"
                type="password"
                placeholder="Password"
              />
              <Button 
                className="modalButton"
                type="submit" 
                bsStyle="primary" 
                onClick={this.loginUser}
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