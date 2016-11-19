import React, { Component } from 'react';
import { Col, Row, Grid, Table, Button, Modal, Checkbox, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { Gmaps, Marker } from 'react-gmaps';
import axios from 'axios';

import apiKeys from '../../server/config/API_Keys';
import Header from './Header';
// import CharityModal from './CharityModal';
import Donation from './Donation';
import EditCauseModal from './EditCauseModal';

class CustomCauseProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charityId: this.props.params.id,
      charity: {},
      donations: [],
      showCauseModal: false,
      editCustomCauseFields: {},
      userSession: {},
      causePrivacy: true
    }
  }

  componentWillMount () {
    axios.get('http://localhost:8080/userSession')
    .then(res => {
      this.setState({
        userSession: res.data
      });
    });
    this.getCharityInfo();

    axios.post('http://localhost:8080/api/customCause/transactions', {
      charityID: this.state.charityId
    })
    .then((res) => {
      console.log('transactions info', res.data)
      this.setState({donations: res.data});
    })
    .catch((err) => {
      console.log(err)
    })
  }

  openCause () {
    this.setState({ showCauseModal: true})
  }

  getCharityInfo () {
    axios.post('http://localhost:8080/charityInfo', {
      charityId: this.state.charityId,
      type: 'custom'
    })
    .then((res) => {
      console.log('cause info', res.data);
      this.setState({charity: res.data})
    })
    .catch((err) => {
      console.log(err)
    })
  }

  closeCause () {
    this.setState({ showCauseModal: false})
  }

  render() {
    return (
      <Header>
      <div className="charityProfilePage">

        <Grid>
          <Row>
            <Col>
              <Button className="loginButton" bsSize="small" onClick={this.openCause.bind(this)}>Edit Cause</Button>
            </Col>
            <h3>{this.state.charity.name}</h3>
            <div className="charityType">{this.state.charity.mission_statement}</div>
            <h3> ${this.state.charity.total_donated * 100 / this.state.charity.dollar_goal ? Math.floor(this.state.charity.total_donated * 100 / this.state.charity.dollar_goal) : 0}% Funded!</h3>
            <h3> Fundraising Goal: ${this.state.charity.dollar_goal}</h3>
            <h3> Total AddUp+ Donations to Date: ${this.state.charity.total_donated}</h3>
          </Row>
          <Row>
            <Col className="userTransactionsContainer">
              <h2>Donations to Cause</h2>
              <div className="transactionHistory">

                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Donor</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.donations.map ((donation, i) =>
                      <Donation key={i} donation={donation} />
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <div>
            <EditCauseModal getCharityInfo={this.getCharityInfo.bind(this)} userSession={this.state.userSession} charity={this.state.charity} showCauseModal={this.state.showCauseModal} closeCause={this.closeCause.bind(this)}/>
          </div>
         
        </Grid>
 
      </div>
    </Header>
    );
  }
}

export default CustomCauseProfilePage;