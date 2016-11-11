import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class SignupModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open () {
    console.log("CLICKED!")
    this.setState({showModal: true})
  }
  close () {
    this.setState({showModal: false})
  }
  render() { 
    return (
      <Modal show={this.state.showModal} onHide={this.close}>
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

export default SignupModal;
