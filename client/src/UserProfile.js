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
      bankInfo: {},
      charities: [],
      customCauses: []
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
          this.setState({
            userInfo: res.data,
            bankInfo: {
              bank_name: res.data.bank_name,
              bank_digits: res.data.bank_digits
            }
          });
          if (this.state.bankInfo.bank_name) {
            this.setState({hasLinkAccount: true});
          } 
          console.log('id ', res.data.id);
          axios.post('http://localhost:8080/charitySearch', {
            'id_owner': res.data.id,
            'type': 'Custom Cause'
            })
            .then(response => {
              this.setState({customCauses: response.data});
              console.log('CUSTOM CAUSES', response.data);
            });
        });

      axios.post('http://localhost:8080/api/user/transactions', {
          'email': email
        })
        .then(res => {
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

    //This is currently not working...supposed to dim any charities that have reached their goals
    $( document ).ready(function() {
      $('.completed').closest('.userCharity').addClass('dim');
    });
  }

  //This is called in PlaidLink.js when a user successfully links a bank account
  displayLinkAccount(bank_name, bank_digits) {
    this.setState({
      hasLinkAccount: true,
      bankInfo: {
        bank_name: bank_name,
        bank_digits: bank_digits
      }
    });
  }

  convertToReadableDate(date_time) {
    var date = new Date(date_time);
    if (date.getFullYear() < 2015) { //if the user hasn't donated yet, it returns default date from 1960s (don't want to display)
      return 'No Donations On File';
    }
    var options = {
      month: "short",
      year: "numeric",
      day: "numeric"
    };
    return 'since ' + date.toLocaleDateString("en-us", options)
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
                <text className='profileHeader'> </text>
                <h1>Link an account to start donating!</h1>
                <PlaidLinkComponent successFunc={this.displayLinkAccount.bind(this)}/>
              </Col>
              :
              <Col className="userBankInfo shadowbox" md={5}>
                <h1>{this.state.bankInfo.bank_name}</h1>
                <text className='account'>Account ending in: {this.state.bankInfo.bank_digits}</text>
              </Col>
            }

              <Col className="userProfile shadowbox"md={6}>
                <h1>{this.state.userSession.firstName} {this.state.userSession.lastName}</h1>
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
                    <a href={'/charity/' + charity.ein}>
                      <div className='userCharity'>
                        <div className='title'>{charity.name}</div>
                        {
                          (charity.goal_reached === '1') ? 
                          <div className='completed'>&#10004; Goal Reached</div>
                          : null
                        }
                        <div className='amount'>${charity.user_donation_total}</div>
                        <div className='since'>{this.convertToReadableDate(charity.initial_date)}</div>
                      </div>
                    </a>
                    )
                }
                </div>
              </Col>
            </Row>
            <Row >
              <Col className="userCharitiesContainer" md={11}>
                <h1>Your Causes</h1>
                <div className='userCharities'>
                {
                  this.state.customCauses.map(cause => 
                    <div className='userCharity'>
                      <text className='title'>{cause.charityName}</text>
                      <div>
                        <text>Percent Funded: </text><text className='amount'>{Math.floor((cause.total_donated/cause.dollar_goal)*100)}%</text>
                      </div>
                      <text>Donated So Far: </text><text className='amount'>${cause.total_donated}</text>
                      <text>Donation Goal: </text><text className='amount'>${cause.dollar_goal}</text>
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
