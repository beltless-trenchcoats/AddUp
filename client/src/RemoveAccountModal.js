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

    this.openRemoveAccountModal = this.openRemoveAccountModal.bind(this);
    this.closeRemoveAccountModal = this.closeRemoveAccountModal.bind(this);
  }

  openRemoveAccountModal () {
    this.setState({showRemoveAccountModal: true});
  }

  closeRemoveAccountModal () {
    this.setState({showRemoveAccountModal: false});
  }

  render() {
    return (
    <div>
      <Button className='removeBankButton' onClick={this.openRemoveAccountModal}>Remove Account</Button>
      <Modal show={this.state.showRemoveAccountModal} onHide={this.closeRemoveAccountModal}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Your Linked Account</Modal.Title>
        </Modal.Header>

        <Modal.Body>Are you sure you want to remove this account from AddUp++? </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.deleteAccount}>Remove Account</Button>
          <Button bsStyle="primary" onClick={this.closeRemoveAccountModal}>Cancel</Button>

        </Modal.Footer>
      </Modal>
    </div>
    );
  }
};

export default RemoveAccountModal;
