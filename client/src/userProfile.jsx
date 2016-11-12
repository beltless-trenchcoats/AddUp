import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Table } from 'react-bootstrap';

import Header from './Header';

class UserProfile extends Component {

  render() {
    return (
      <Header>
        <div className="profilePage">
          <div className="userProfile">
            <Col md={6} mdPush={6} >
            <h1>Profile</h1>
            <h3> Username: </h3>

            </Col>
          </div>

          <div className="userBankInfo">
            <Col md={6} mdPull={6}>
              <form id="some-id" method="POST" action="/authenticate"></form>
              <PlaidLinkComponent />
              CHECK ON THE USER INFO
            </Col>
          </div>

          <div className="transactionHistory">
            <h2>TransactionHistory</h2>
            <Table responsive striped hover>
              <thead>
                <th>Date</th>
                <th>Type</th>
                <th>AddUp Amount</th>
                <th>Cause</th>
              </thead>

            </Table>

          </div>

        </div>
      </Header>
    );
  }
}

export default UserProfile;
