import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Row, Grid, Table } from 'react-bootstrap';
import axios from 'axios';
import $ from "jquery";

import Header from './Header';
import Transaction from './Transaction';

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      userSession: {},
      hasLinkAccount: false,
      userInfo: {}
    }
  }

  componentWillMount() {
    axios.get('http://localhost:8080/userSession')
    .then(res => {
      this.setState({
        userSession: res.data
      });

      var email = this.state.userSession.email;

      axios.post('http://localhost:8080/api/user/info', {
        'email': email
      })
      .then(res => {
        axios.post('http://localhost:8080/api/user/transactions', {
          'email': email
        })
        .then(res => {
          this.setState({transactions: res.data})
        })
      })
    })
  }
  
  componentDidMount() {
    $('.userBankInfo div button span').html('Add Account');

  }

  render() {
    return (
      <Header>
        <div className="profilePage">
          
          <Grid>
            <Row> 
            {
              !this.state.hasLinkAccount ? 
              <Col className="userBankInfo shadowbox" md={5}>
                <form id="some-id" method="POST" action="/authenticate"></form>
                <h1>Link an account to start donating!</h1>
                <PlaidLinkComponent className='plaidLinkButton'/>
              </Col>
              :
              <Col className="userBankInfo shadowbox" md={5}>
                <h1>Your Bank Institution</h1>
                <text>Account ending in: 4345</text>
              </Col>
            }

              <Col className="userProfile shadowbox"md={6}>
                <h1>My Profile</h1>
                <div className='profileField'><span className='label'>Name:</span><span className='value'> {this.state.userSession.firstName} {this.state.userSession.lastName}</span><button>Change</button></div>
                <div className='profileField'><span className='label'>Email:</span><span className='value'> {this.state.userSession.email}</span><button>Change</button></div>
                <div className='profileField'><span className='label'>Password: </span><button>Change</button></div>
              </Col>
            </Row>

            <Row >
              <Col className="userCharitiesContainer" md={11}>
                <h1>Your Charities</h1>
                <div className='userCharities'>
                  <div className='userCharity'>
                    <text className='title'>Charity name</text>
                    <text className='amount'>$4.38</text>
                    <text className='since'>since Nov 15, 2016</text>
                  </div>
                  <div className='userCharity'>
                    <text className='title'>Charity name</text>
                    <text className='amount'>$12.07</text>
                    <text className='since'>since Apr 2, 2016</text>
                  </div>
                </div>
              </Col>
            </Row>
            <Row >
              <Col className="userTransactionsContainer">
                <h2>Transaction History</h2>
                <div className="transactionHistory">

                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Recipient</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.transactions.map ((transaction, i) => 
                        <Transaction key={i} info={transaction} />
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Grid>

        </div>
      </Header>
    );
  }
}

export default UserProfile;
