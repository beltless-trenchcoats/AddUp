import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Row, Table } from 'react-bootstrap';

import Header from './Header';

class UserProfile extends Component {

  render() {
    return (
      <Header>
        <div className="profilePage">
          
          <Row> 
          <Col className="userProfile"md={6} mdPush={6} >
            <h1>Profile</h1>
            <h3> Username: </h3>
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

        </div>
      </Header>
    );
  }
}

export default UserProfile;
