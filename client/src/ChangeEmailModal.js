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
};

class ChangeEmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangeEmailModal: false,
      newEmail1: undefined,
      newEmail2: undefined,
      newEmailMatch: true,
    };

    this.openEmail = this.openEmail.bind(this);
    this.closeEmail = this.closeEmail.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.newEmail1 = this.newEmail1.bind(this);
    this.newEmail2 = this.newEmail2.bind(this);
    this.renderEmailChange = this.renderEmailChange.bind(this);

  }

  openEmail () {
    this.setState({ showChangeEmailModal: true});
  }

  closeEmail () {
    this.setState({ showChangeEmailModal: false});
  }

  newEmail1 (e) {
    this.setState({ newEmail1: e.target.value});
  }

  newEmail2 (e) {
    this.setState({ newEmail2: e.target.value});
  }

  renderEmailChange () {
    let userSession = this.props.session;
    userSession.email = this.state.newEmail1;
    this.setState({ userSession: userSession});
  }

  checkEmail(e) {
    e.preventDefault();
    if (this.state.newEmail1 === this.state.newEmail2) {
      this.setState({ newEmailMatch: true });
      this.closeEmail();
      axios.post(server + '/api/user/update', {
        email: this.props.session.email,
        newEmail: this.state.newEmail1,
      })
      .then(function(res) {
        console.log('Response in checkEmail ', res);
      })
      .catch(function(err) {
        console.log('error in checkEmail POST ', err);
      });
    } else {
      this.setState({ newEmailMatch: false });
    }
    this.renderEmailChange.call(this);
    this.setState({newEmail1: undefined, newEmail2: undefined});
  }

  render() {
    return (
      <div>
        <Button className="changeButton" bsSize="small" onClick={this.openEmail}>Change</Button>

        <Modal className="modal" show={this.state.showChangeEmailModal} onHide={this.closeEmail}>
          <Modal.Header closeButton>
            <Modal.Title>Change Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please enter your new email</p>

            <form onSubmit={this.signupUser}>
              <FieldGroup
                id="formControlsFirstname"
                type="text"
                required={true}
                label="New Email*"
                placeholder="Email"
                onChange={this.newEmail1}
              />
              <FieldGroup
                id="formControlsLastname"
                type="text"
                required={true}
                label="Confirm Email*"
                placeholder="Confirm Email"
                onChange={this.newEmail2}
              />
              <Button
                className="modalButton"
                type="submit"
                bsStyle="primary"
                onClick={this.checkEmail}
                >Change Email
              </Button>
              {this.state.newEmailMatch ? null : <div className="emailMatchError">Email's do not match</div>}
              <Button className="modalButton" onClick={this.closeEmail}>Cancel</Button>

            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ChangeEmailModal;