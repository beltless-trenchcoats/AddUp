import React, { Component } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery';

import CharityModalEntry from './CharityModalEntry';

class CharityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: [],
      updatedCharities: [],
      userEmail: '',
      donationTotal: 0
    }
    this.updateCharities = this.updateCharities.bind(this)
    this.saveCharities = this.saveCharities.bind(this)
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
          this.props.currentCharity.percentage = 0;
          res.data.push(this.props.currentCharity)
          console.log('currentcharity!', this.props.currentCharity)
          this.setState({
            updatedCharities: res.data,
            charities: res.data })
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
    var donationTotal = this.state.donationTotal
    this.setState( { donationTotal:  donationTotal += percentage} )
    console.log('total', this.state.donationTotal)
  }

  close() {
    this.props.onHide();
    this.setState({ donationTotal: 0 })
  }

  updateCharities (index, charityId, remove, percentage) {
    console.log('REMOVE', remove)
    let updates = $.extend(true, [], this.state.updatedCharities)
    updates[index].remove = remove;
    updates[index].id = charityId;
    updates[index].percentage = percentage;
    this.setState({ updatedCharities: updates });
    console.log('withUpdateCharities', updates)
  }

  saveCharities () {
    console.log('updated in saveCharities', this.state.updatedCharities)
    this.setState( {charities: this.state.updatedCharities})
      axios.post('http://localhost:8080/api/user/updateCharity', {
        email: this.state.userEmail,
        charities: this.state.updatedCharities
      })
      .then((res) => {
        console.log('response', res)
      })
      .catch((err) => {
        console.log(err)
      })
    this.close();
    // this.forceUpdate();
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
                <CharityModalEntry
                  key={i}
                  index={i}
                  charity={charity}
                  updateTotal={this.updateTotal}
                  save={ this.updateCharities }/>
              )}
            </tbody>
          </Table>

        </Modal.Body>

        <Modal.Footer>
          <div className="percentageError">{this.state.donationTotal > 1 ? <div>Donation total cannot be over 100%</div> : null}</div>
          <Button bsStyle="primary" onClick={this.saveCharities} disabled={this.state.donationTotal > 1} >Save</Button>
          <Button onClick={this.close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};


export default CharityModal;
