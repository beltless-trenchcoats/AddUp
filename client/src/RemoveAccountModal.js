import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import server from '../../server/config/config';
import axios from 'axios';

class RemoveAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRemoveAccountModal: false
      
    };
    this.close = this.close.bind(this);
  }

  close() {
    this.props.onHide();
  }

  render() {
    {console.log('currentUSer', this.props.currentUser.email)}
    return (
        <Modal show={this.props.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Remove Your Linked Account</Modal.Title>
          </Modal.Header>

          <Modal.Body>Are you sure you want to remove this account from AddUp++? </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.deleteAccount}>Remove Account</Button>
            <Button bsStyle="primary" onClick={this.close}>Cancel</Button>

          </Modal.Footer>
        </Modal>
    );
  }
};

export default RemoveAccountModal;
