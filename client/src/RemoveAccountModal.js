import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

// import axios from 'axios';

class RemoveAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRemoveAccountModal: false
      
    };
    this.deleteAccount = this.deleteAccount.bind(this);
    this.close = this.close.bind(this);
  }

  deleteAccount() {

  }

  close() {
    this.props.onHide();
  }

  render() {
    {console.log(this.props)}
    return (
        <Modal classNam show={this.props.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Remove Your Linked Account</Modal.Title>
          </Modal.Header>

          <Modal.Body>Are you sure you want to remove this account from AddUp++? </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.deleteAccount}>Remove Account</Button>
            <Button onClick={this.close}>Cancel</Button>

          </Modal.Footer>
        </Modal>
    );
  }
};

export default RemoveAccountModal;
