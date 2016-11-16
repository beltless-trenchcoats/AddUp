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
      userInfo: {},
      charities: []
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
          this.setState({userInfo: res.data});
          if (this.state.userInfo.bank_name) {
            this.setState({hasLinkAccount: true});
          } 
        });

      axios.post('http://localhost:8080/api/user/transactions', {
          'email': email
        })
        .then(res => {
          console.log(res.data);
          this.setState({transactions: res.data})
        });

      axios.post('http://localhost:8080/api/user/charities/info', {
        'email': email
        })
        .then(res => {
          this.setState({charities: res.data})
        });
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
                <h1>{this.state.userInfo.bank_name}</h1>
                <text>Account ending in: {this.state.userInfo.bank_digits}</text>
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
                {
                  this.state.charities.map(charity => 
                    <div className='userCharity'>
                      <text className='title'>{charity.name}</text>
                      <text className='amount'>${charity.total_donated}</text>
                      <text className='since'>since [date of first transaction]</text>
                    </div>
                    )
                }
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
                        <Transaction key={i} transaction={transaction} />
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
