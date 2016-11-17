
import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Row, Grid, Table, Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';
import $ from "jquery";

import Header from './Header';
import Transaction from './Transaction';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

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
      customCauses: [],
      showChangePasswordModal: false,
      showChangeEmailModal: false,
      newPassword1: undefined,
      newPassword2: undefined,
      newEmail1: undefined,
      newEmail2: undefined
    }
    this.openEmail = this.openEmail.bind(this);
    this.closeEmail = this.closeEmail.bind(this);
    this.openPassword = this.openPassword.bind(this);
    this.closePassword = this.closePassword.bind(this);
    this.newPassword1 = this.newPassword1.bind(this);
    this.newPassword2 = this.newPassword2.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.newEmail1 = this.newEmail1.bind(this);
    this.newEmail2 = this.newEmail2.bind(this);
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
          this.setState({transactions: res.data});
        });

      axios.post('http://localhost:8080/api/user/charities/info', {
        'email': email
        })
        .then(res => {
          this.setState({charities: res.data});
        });
    })
  }

  openEmail () {
    this.setState({ showChangeEmailModal: true});
  }

  closeEmail () {
    this.setState({ showChangeEmailModal: false});
  }

  openPassword () {
    this.setState({ showChangePasswordModal: true});
  }

  closePassword () {
    this.setState({ showChangePasswordModal: false});
  }

  newPassword1 (e) {
    this.setState({ newPassword1: e.target.value});
  }

  newPassword2 (e) {
    this.setState({ newPassword2: e.target.value});
  }

  newEmail1 (e) {
    this.setState({ newEmail1: e.target.value});
  }

  newEmail2 (e) {
    this.setState({ newEmail2: e.target.value});
  }

  toggleModal () {
    this.setState({
      showChangeEmailModal: !this.state.showChangeEmailModal,
      showChangePasswordModal: !this.state.showChangePasswordModal
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

  checkPassword (e) {
    e.preventDefault();
    if(this.state.newPassword1 === this.state.newPassword2) {
      this.closePassword();
      axios.post('http://localhost:8080/api/user/updateUser', {
        email: this.state.userSession.email,
        newEmail1: this.state.newEmail1,
        newPassword: this.state.newPassword1
      })
      .then(function(res) {
        console.log('res ', res);
      })
      .catch(function(err) {
        console.log('error in checkPassword POST ', err);
      })
    } else {
      console.log('Passwords dont match!');
    }
    this.setState({newPassword1: undefined, newPassword2: undefined});
  }

  checkEmail(e) {
    e.preventDefault();
    if(this.state.newEmail1 === this.state.newEmail2) {
      this.closeEmail();
      axios.post('http://localhost:8080/api/user/updateUser', {
        email: this.state.userSession.email,
        newEmail1: this.state.newEmail1,
        newPassword: this.state.newPassword1
      })
      .then(function(res) {
        console.log('res ', res);
      })
      .catch(function(err) {
        console.log('error in checkEmail POST ', err);
      })
    } else {
      console.log('Emails dont match!');
    }
    this.setState({newEmail1: undefined, newEmail2: undefined});
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
                <div className='profileField'><span className='label'>Email:</span><span className='value'> {this.state.userSession.email}</span>
                  {<Button className="loginButton" bsSize="small" onClick={this.openEmail}>Change</Button>}</div>
                <div className='profileField'><span className='label'>Password: </span>
                  {<Button className="loginButton" bsSize="small" onClick={this.openPassword}>Change</Button>}
                </div>
              </Col>
            </Row>
            <div>
              <Modal className="modal" show={this.state.showChangeEmailModal} onHide={this.closeEmail}>
                <Modal.Header closeButton>
                  <Modal.Title>Change Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Please enter your new email</p>

                  <form onSubmit={this.signupUser}>
                    <FieldGroup
                      id="formControlsFirstname"
                      type="text"
                      required={true}
                      label="New Email*"
                      placeholder="Email"
                      onChange={this.newEmail1}
                    />
                    <FieldGroup
                      id="formControlsLastname"
                      type="text"
                      required={true}
                      label="Confirm Email*"
                      placeholder="Confirm Email"
                      onChange={this.newEmail2}
                    />
                    <Button
                      className="modalButton"
                      type="submit"
                      bsStyle="primary"
                      onClick={this.checkEmail}
                      >Change Email
                    </Button>
                    <Button className="modalButton" onClick={this.closeEmail}>Cancel</Button>

                  </form>
                </Modal.Body>
              </Modal>
            </div>
            <div>
              <Modal className="modal" show={this.state.showChangePasswordModal} onHide={this.closePassword}>
                <Modal.Header closeButton>
                  <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Please enter your new password</p>

                  <form onSubmit={this.signupUser}>
                    <FieldGroup
                      id="formControlsFirstname"
                      type="password"
                      required={true}
                      label="New Password*"
                      placeholder="Password"
                      onChange={this.newPassword1}
                    />
                    <FieldGroup
                      id="formControlsLastname"
                      type="password"
                      required={true}
                      label="Confirm Password*"
                      placeholder="Confirm Password"
                      onChange={this.newPassword2}
                    />
                    <Button
                      className="modalButton"
                      type="submit"
                      bsStyle="primary"
                      onClick={this.checkPassword}
                      >Change Password
                    </Button>
                    <Button className="modalButton" onClick={this.closePassword}>Cancel</Button>
                  </form>

                </Modal.Body>
              </Modal>
            </div>
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
