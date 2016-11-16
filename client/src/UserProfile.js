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
    })
  }
  
  componentDidMount() {
    $('.userBankInfo div button span').html('Add Account');
    axios.post('http://localhost:8080/userfield', {
      email: 'test@gmail.com'
    }).then((response) => {
      axios.post('http://localhost:8080/transactions', {
        access_token: response.data
      })
      .then((res) => {
        console.log(res.data.transactions)
        this.setState({transactions: res.data.transactions})
      })
      .catch((err) => {
        console.log(err)
      })
    })
    .catch((error) => {
      console.log(error)
    })
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
            <Row className="transactionHistory">
              <h2>Transaction History</h2>

              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>AddUp Amount</th>
                    <th>Cause</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.transactions.filter((transaction) => transaction.amount > 0).map ((transaction, i) => 
                    <Transaction key={i} info={transaction} />
                  )}

                </tbody>

              </Table>
            </Row>
          </Grid>

        </div>
      </Header>
    );
  }
}

export default UserProfile;
