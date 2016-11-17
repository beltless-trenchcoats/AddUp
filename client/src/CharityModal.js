import React, { Component } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';

import CharityModalEntry from './CharityModalEntry';

class CharityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: [],
      userEmail: '',
      donationTotal: 0
    }
    this.updateCharities = this.updateCharities.bind(this)
    this.updateTotal = this.updateTotal.bind(this)
    this.close = this.close.bind(this)
  }

  componentWillMount () {
    axios.get('http://localhost:8080/userSession')
      .then((res) => {
        this.setState({ userEmail: res.data.email || '' });
        axios.post('http://localhost:8080/api/user/charities/donationInfo', {
          email: this.state.userEmail
        })
        .then((res) => {
          if (this.props.currentCharity)
          this.setState({ charities: res.data })
        })
        .catch((err) => {
          console.log(err)
        })
      })
      .catch((err) => {
        console.log(err);
      }); 
  }

  updateTotal (percentage) {
    let oldTotal = this.state.donationTotal;
    this.setState( { donationTotal: this.state.donationTotal += Number(percentage) })
    console.log('total', this.state.donationTotal)
  }

  close() {
    this.props.onHide();
    this.setState( {donationTotal: 0} )
  }

  updateCharities (style, percentage) {
    console.log('style:', style, 'percentage:', percentage)
    axios.post()
  }

  render() {
    return (
      <Modal className="charityModal" show={this.props.show} onHide={this.close}>
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
                <CharityModalEntry key={i} charity={charity} updateTotal={this.updateTotal} save={this.updateCharities}/>
              )}
            </tbody>
          </Table>
          
        </Modal.Body>

        <Modal.Footer>
          <div className="percentageError">{this.state.donationTotal > 1 ? <div>Donation total cannot be over 100%</div> : null}</div>
          <Button bsStyle="primary" onClick={this.updateCharities} disabled={this.state.donationTotal > 1} >Save</Button>
          <Button onClick={this.close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};


export default CharityModal;

