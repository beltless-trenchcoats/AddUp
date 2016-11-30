import React, { Component } from 'react';
import axios from 'axios';
import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';

import server from '../../server/config/config';

import logo from '../assets/images/addUpLogoUpdated.png';
import FaUser from 'react-icons/lib/fa/user';
import helpers from '../helpers';

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
      loggedIn: false,
      validationError: false,
      email: '',
      password1: '',
      password2: '',
      firstname: '',
      lastname: '',
      invalidPassword: false
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
    this.onPassword1Change = this.onPassword1Change.bind(this)
    this.onPassword2Change = this.onPassword2Change.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onFirstnameChange = this.onFirstnameChange.bind(this)
    this.onLastnameChange = this.onLastnameChange.bind(this)
  }

  componentWillMount() {
    var cookies = helpers.parseCookie(document.cookie);
    this.setState({
      email: cookies.email || '',
      firstname: cookies.firstname || '',
      lastname: cookies.lastname || '',
      loggedIn: !!(cookies.email)
    });
    console.log('all cookies', cookies); // => ""
  }
  
  closeLogin() {
    this.setState({ showLoginModal: false, validationError: false });
  }
  openLogin() {
    this.setState({ showLoginModal: true });
  }
  closeSignup() {
    this.setState({ showSignupModal: false, validationError: false });
  }
  openSignup() {
    this.setState({invalidPassword: false});
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
    if (!this.validatePassword(this.state.password1)) {
      this.setState({invalidPassword: true});
    } else if(this.state.password1 === this.state.password2) {
      axios.post(server + '/api/session/signup', {
        email: this.state.email,
        password: this.state.password1,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
      })
      .then((res) => {
        if (res.data) {
          document.cookie = "email=" + res.data.email;
          document.cookie = "firstname=" + res.data.first_name;
          document.cookie = "lastname=" + res.data.last_name;
          this.setState({
            loggedIn: true
          });
          this.closeSignup();
          browserHistory.push('/user');
        } else {
          this.setState({
            validationError: true
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else {
      this.setState({ validationError: true});
    }
  }

  validatePassword(password) {
    return (password.search(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&])[A-Za-z\d$@$!#%*?&]{8,}/i) !== -1)
  }

  loginUser (e) {
    e.preventDefault();
    axios.post(server + '/api/session/login', {
      email: this.state.email,
      password: this.state.password1
    })
    .then((res) => {
      if (res.data) {
        this.setState({
          email: res.data.email,
          firstname: res.data.first_name,
          lastname: res.data.last_name,
          loggedIn: true
        });
        document.cookie = "email=" + res.data.email;
        document.cookie = "firstname=" + res.data.first_name;
        document.cookie = "lastname=" + res.data.last_name;
        // cookie.save('email', res.data.email, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10, secure: true });
        // cookie.save('firstname', res.data.first_name, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10, secure: true });
        // cookie.save('lastname', res.data.last_name, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10, secure: true });
        this.closeLogin();
        browserHistory.push('/user');
      } else {
        this.setState({
          validationError: true
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  logoutUser () {
    axios.get(server + '/api/session/logout')
    .then((res) => {
      this.setState({
        loggedIn: false,
        email: '',
        password1: '',
        password2: '',
        firstname: '',
        lastname: ''
      });
      document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'firstname=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'lastname=; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      this.closeLogout();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  onPassword1Change (e) {
    var invalidPassword = !this.validatePassword(e.target.value);
    this.setState({password1: e.target.value, invalidPassword: invalidPassword});
  }

  onPassword2Change (e) {
    this.setState({password2: e.target.value})
  }

  onEmailChange (e) {
    this.setState({email: e.target.value})
  }

  onFirstnameChange (e) {
    this.setState({firstname: e.target.value})
  }

  onLastnameChange (e) {
    this.setState({lastname: e.target.value})
  }

  render() {
    return (
      <header>
        <div className="App-header">
          <Link to="/" className="logo">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>

          <div className="userButtons">
            {this.state.loggedIn ? <Link to="/user"><span className="userProfileLink"><FaUser className="userIcon"/> Hello, {this.state.firstname}!</span></Link> : null}
            <Link to="/about"><button className='headerButton'>About</button></Link>
            <Link to="/search"><button className='headerButton'>Search</button></Link>
            {this.state.loggedIn ? <button className="headerButton loginoutButton" onClick={this.openLogout}>Logout</button> : null}
            {this.state.loggedIn ? null : <button className="headerButton loginoutButton" onClick={this.openLogin}>Login</button>}
            {this.state.loggedIn ? null : <button className="headerButton loginoutButton" onClick={this.openSignup}>Sign Up</button>}
          </div>

        </div>

        {/*Signup Modal*/}
        <Modal className="modal" show={this.state.showSignupModal} onHide={this.closeSignup}>
          <Modal.Header closeButton>
            <Modal.Title>Create Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please provide your user information to create your AddUp+ Account</p>

            <form onSubmit={this.signupUser}>
              <FieldGroup
                id="formControlsFirstname"
                type="text"
                required={true}
                label="First Name*"
                placeholder="First Name*"
                onChange={this.onFirstnameChange}
              />
              <FieldGroup
                id="formControlsLastname"
                type="text"
                required={true}
                label="Last Name*"
                placeholder="Last Name*"
                onChange={this.onLastnameChange}
              />
              <FieldGroup
                id="formControlsEmail"
                type="email"
                required={true}
                label="Email*"
                placeholder="Enter Email*"
                onChange={this.onEmailChange}
              />
              {
                this.state.invalidPassword ? <div className='error'>Password must be at least 8 digits and contain a character, number, and special character</div> : null
              }
              <FieldGroup
                id="formControlsPassword"
                type="password"
                required={true}
                label="Password*"
                placeholder="Password*"
                onChange={this.onPassword1Change}
              />
              <FieldGroup
                id="formControlsPassword"
                type="password"
                required={true}
                label="Confirm Password*"
                placeholder="Confirm Password*"
                onChange={this.onPassword2Change}
              />
              {
                this.state.validationError ? <div className='error'>Email already registered/Password's dont match</div> : null
              }
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
                type="email"
                label="Email"
                placeholder="Enter email"
                onChange={this.onEmailChange}
              />
              <FieldGroup
                id="formControlsPassword"
                label="Password"
                type="password"
                placeholder="Password"
                onChange={this.onPassword1Change}
              />
              {
                this.state.validationError ? <div className='error'>Email/password combination invalid</div> : null
              }
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
            <Button href="/" className="modalButton" bsStyle="primary" onClick={this.logoutUser}>Logout</Button>
            <Button className="modalButton" onClick={this.closeLogout}>Cancel</Button>

          </Modal.Body>
        </Modal>

        {this.props.children}
      </header>
    );
  }
}

export default Header;
