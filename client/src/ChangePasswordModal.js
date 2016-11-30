import React, { Component } from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import server from '../../server/config/config';

import axios from 'axios';


const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

class ChangePasswordModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showChangePasswordModal: false,
      newPassword1: undefined,
      newPassword2: undefined,
      newPasswordMatch: true
    };

    this.openPassword = this.openPassword.bind(this);
    this.closePassword = this.closePassword.bind(this);
    this.newPassword1 = this.newPassword1.bind(this);
    this.newPassword2 = this.newPassword2.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
  }

  openPassword () {
    this.setState({ showChangePasswordModal: true});
  }

  closePassword () {
    this.setState({ showChangePasswordModal: false});
  }

  newPassword1 (e) {
    this.setState({ newPassword1: e.target.value});
  }

  newPassword2 (e) {
    this.setState({ newPassword2: e.target.value});
  }

  checkPassword (e) {
    e.preventDefault();
    if(this.state.newPassword1 === this.state.newPassword2) {
      this.setState({ newPasswordMatch: true});
      this.closePassword();
      axios.post(server + '/api/user/update', {
        email: this.props.session.email,
        newPassword: this.state.newPassword1
      })
      .then(function(res) {
        console.log('Response in checkPassword ', res);
      })
      .catch(function(err) {
        console.log('error in checkPassword POST ', err);
      })
    } else {
      this.setState({ newPasswordMatch: false });
    }
    this.setState({newPassword1: undefined, newPassword2: undefined});
  }


  render() {
    return (
      <div>
        <Button className="changeButton" bsSize="small" onClick={this.openPassword}>Change</Button>

        <Modal className="modal" show={this.state.showChangePasswordModal} onHide={this.closePassword}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please enter your new password</p>

            <form onSubmit={this.signupUser}>
              <FieldGroup
                id="formControlsFirstname"
                type="password"
                required={true}
                label="New Password*"
                placeholder="Password"
                onChange={this.newPassword1}
              />
              <FieldGroup
                id="formControlsLastname"
                type="password"
                required={true}
                label="Confirm Password*"
                placeholder="Confirm Password"
                onChange={this.newPassword2}
              />
              <Button
                className="modalButton"
                type="submit"
                bsStyle="primary"
                onClick={this.checkPassword}
                >Change Password
              </Button>
              {this.state.newPasswordMatch ? null : <div className="matchError">Password's do not match</div>}
              <Button className="modalButton" onClick={this.closePassword}>Cancel</Button>
            </form>
            </Modal.Body>
          </Modal>
        </div>
    );
  }
}

export default ChangePasswordModal;