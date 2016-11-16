import React, { Component } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';

import CharityModalEntry from './CharityModalEntry';

class CharityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: [],
      userEmail: ''
    }
  }

  componentWillMount () {
    axios.get('http://localhost:8080/userInfo')
    .then((res) => {
      this.setState({ userEmail: res.data.email || '' });
      axios.post('http://localhost:8080/userCharities', {
        email: this.state.userEmail
      })
      .then((response) => {
        response.data.push(this.props.currentCharity)
        this.setState({ charities: response.data })
      })
      .catch((err) => {
        console.log(err)
      })
    })
    .catch((err) => {
      console.log(err);
    }); 
  }

  render() {
    return (
      <Modal className="charityModal" show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Update Your Charity Selections</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Table>
            <thead>
              <tr> 
                <th>Charity Name</th>
                <th>Total Donations</th>
                <th>Current Percentage Donation</th>
                <th>Remove Charity</th>
              </tr>
            </thead>

            <tbody>
              {this.state.charities.map((charity, i) => 
                // console.log('charity', charity)
                <CharityModalEntry key={i} charity={charity} />
              )}
            </tbody>
          </Table>
          
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary">Save</Button>
          <Button>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};


export default CharityModal;

