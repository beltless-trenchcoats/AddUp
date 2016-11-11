import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class LoginModal extends Component {

  render() { 
    return (
      <Modal>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default LoginModal;