import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Row, Grid, Table } from 'react-bootstrap';

import Header from './Header';

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: []
    }
  }

  ComponentDidMount () {

  }

  render() {
    return (
      <Header>
        <div className="profilePage">
          
          <Grid>
            <Row> 
            <Col className="userProfile"md={6} mdPush={6} >
              <h1>Profile</h1>
              <h3> Email: </h3>
              <h3> Donated to Date: </h3>
            </Col>

            <Col className="userBankInfo" md={6} mdPull={6}>
              <form id="some-id" method="POST" action="/authenticate"></form>
              CHECK ON THE USER INFO
              <PlaidLinkComponent />
            </Col>
            </Row>

            <Row className="transactionHistory">
              <h2>TransactionHistory</h2>

              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>AddUp Amount</th>
                    <th>Cause</th>
                  </tr>
                </thead>

              </Table>
            </Row>

          </Grid>

        </div>
      </Header>
    );
  }
}

export default UserProfile;
