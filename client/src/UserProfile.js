
import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Row, Grid, Table, Button, Modal, Checkbox, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
// import { scalePow, scaleLog } from 'd3-scale';
import axios from 'axios';
import $ from "jquery";

import Header from './Header';
import Transaction from './Transaction';
import CharityModal from './CharityModal';
import CustomCauseModal from './CustomCauseModal';
import ChangeEmailModal from './ChangeEmailModal';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

let data2 = [];

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      userSession: {},
      hasLinkAccount: false,
      monthlyLimitSet: false,
      charitiesSelected: false,
      userInfo: {},
      monthlyLimit: '--',
      newMonthlyLimit: 0,
      bankInfo: {},
      charities: [],
      customCauses: [],
      showChangePasswordModal: false,
      showEditCharitiesModal: false,
      newPassword1: undefined,
      newPassword2: undefined,
      newPasswordMatch: true,
    }
    this.openPassword = this.openPassword.bind(this);
    this.closePassword = this.closePassword.bind(this);
    this.newPassword1 = this.newPassword1.bind(this);
    this.newPassword2 = this.newPassword2.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.setCustomCauses = this.setCustomCauses.bind(this);
    this.setSession = this.setSession.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:8080/api/session')
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
            },
            monthlyLimit: res.data.monthly_limit || '--'
          });
          if (this.state.monthlyLimit && this.state.monthlyLimit !== '--') {
            this.setState({monthlyLimitSet: true});
            $('#step2').removeClass('incomplete');
          } else {
            $('#step2').addClass('incomplete');
          }
          if (this.state.bankInfo.bank_name) {
            this.setState({hasLinkAccount: true});
            $('#step1').removeClass('incomplete');
          } else{
            $('#step1').addClass('incomplete');
          }
          console.log('id ', res.data.id);
          var userSession = this.state.userSession;
          userSession.id = res.data.id;
          this.setState({userSession: userSession});
          axios.post('http://localhost:8080/api/charities/search', {
            'id_owner': res.data.id,
            'type': 'Custom Cause'
            })
            .then(response => {
              if (response.data) {
                this.setState({customCauses: response.data});
              }
            });
        });

      axios.post('http://localhost:8080/api/user/transactions', {
          'email': email
        })
        .then(res => {
          this.setState({transactions: res.data});
          res.data.map( (transaction) => {
            data2.push({'name': transaction.name, 'Donated': transaction.amount});
          })
        });

      axios.post('http://localhost:8080/api/user/charities/info', {
        'email': email
        })
        .then(res => {
          this.setState({charities: res.data});
          if (this.state.charities.length) {
            this.setState({charitiesSelected: true});
            $('#step3').removeClass('incomplete');
          } else {
            $('#step3').addClass('incomplete');
          }
        });
    })
  }

  updateCharities(charities) {
    this.setState({charities: charities});
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

  toggleModal () {
    this.setState({
      showChangeEmailModal: !this.state.showChangeEmailModal,
      showChangePasswordModal: !this.state.showChangePasswordModal
    })
  }

  componentDidMount() {
    //Style pre-styled Plaid Link Button
    $('.stepBox div button span').html('Add Account');
    $('.stepBox div button').addClass('btn');
    $('.stepBox div button').addClass('btn-default');

    if (!this.state.hasLinkAccount) {
      $('#step1').addClass('incomplete');
    } else {
      $('#step1').removeClass('incomplete');
    }

    if (!this.state.monthlyLimitSet) {
      $('#step2').addClass('incomplete');
    } else {
      $('#step2').removeClass('incomplete');
    }

    if (!this.state.charitiesSelected) {
      $('#step3').addClass('incomplete');
    } else {
      $('#step3').removeClass('incomplete');
    }

    //This is currently not working...supposed to dim any charities that have reached their goals
    $( document ).ready(function() {
      $('.goalReached').closest('.userCharity').addClass('dim');
    });
  }

  //This is called in PlaidLink.js when a user successfully links a bank account
  displayLinkAccount(bank_name, bank_digits) {
    $('#step1').removeClass('incomplete');
    this.setState({
      hasLinkAccount: true,
      bankInfo: {
        bank_name: bank_name,
        bank_digits: bank_digits
      }
    });
  }

  newLimit(e) {
    this.setState({newMonthlyLimit: e.target.value});
  }

  setMontlyLimit(e) {
    e.preventDefault();
    axios.post('http://localhost:8080/api/user/update/limit', {
      email: this.state.userSession.email,
      limit: this.state.newMonthlyLimit
    }).then(() => {
      $('#step2').removeClass('incomplete');
      this.setState({
        monthlyLimit: this.state.newMonthlyLimit,
        monthlyLimitSet: true
      });
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
      this.setState({ newPasswordMatch: true});
      this.closePassword();
      axios.post('http://localhost:8080/api/user/update', {
        email: this.state.userSession.email,
        newEmail1: this.state.newEmail1,
        newPassword: this.state.newPassword1
      })
      .then(function(res) {
        console.log('Response in checkPassword ', res);
      })
      .catch(function(err) {
        console.log('error in checkPassword POST ', err);
      })
    } else {
      this.setState({ newPasswordMatch: false });
    }
    this.setState({newPassword1: undefined, newPassword2: undefined});
  }

  openEditCharitiesModal() {
    this.setState({ showEditCharitiesModal: true });
  }
  closeEditCharitiesModal() {
    this.setState({ showEditCharitiesModal: false });
  }

  scrollDown() {
    $('html,body').animate({
        scrollTop: $('#charities').offset().top
      }, 'slow');
  }

  setCustomCauses(causes) {
    this.setState({customCauses: causes});
  }

  setSession(session) {
    this.setState({ userSession: session});
  }

  render() {
    return (
      <Header>
        <div className="profilePage">

          <Grid>
            <Row>
              <Col md={6}>
                <div className="userProfile">
                <div className='welcome'>Welcome, {this.state.userSession.firstName} {this.state.userSession.lastName}</div>
                  <div className='profileField'>
                    <span className='label'>Email:</span>
                    <span className='value'> {this.state.userSession.email}</span>
                    <ChangeEmailModal session={this.state.userSession} setSession={this.setSession}/>
                  </div>
                  <div className='profileField'>
                    <span className='label'>Password:</span>
                    <span className='value'>*******</span>
                    {<Button className="changeButton" bsSize="small" onClick={this.openPassword}>Change</Button>}
                  </div>
                  <div className='profileField'>
                    <span className='label'>Monthly Limit: </span>
                    {this.state.monthlyLimit ? $ : null}
                    <span className='value'>$ {this.state.monthlyLimit}</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <div className='profileOptions'>
                <Col md={4}>
                  <div className='step'>Step 1</div>
                {
                  !this.state.hasLinkAccount ?
                    <div id='step1' className='stepBox shadowbox'>
                      <form id="some-id" method="POST" action="/api/plaid/authenticate"></form>
                      <text className='profileHeader'> </text>
                      <div className='linkText'>Link a bank account</div>
                      <PlaidLinkComponent successFunc={this.displayLinkAccount.bind(this)}/>
                    </div>
                  :
                    <div id='step1' className="stepBox shadowbox">
                      <div className='linked'>&#10004;</div>
                      <div className='stepText'>{this.state.bankInfo.bank_name}</div>
                      <text className='account'>Account ending in: {this.state.bankInfo.bank_digits}</text>
                    </div>
                }
                </Col>
                <Col md={4}>
                  <div className='step'>Step 2</div>
                  <div id='step2' className="stepBox shadowbox">
                    {
                      this.state.monthlyLimitSet ? <div className='linked'>&#10004;</div> : null
                    }
                    <div className='stepText'>Set A Monthly Limit</div>
                    <text className='limit'>$ <FormControl id='limitInput' placeholder='e.g. 50' onChange={this.newLimit.bind(this)}></FormControl></text>
                    <Button onClick={this.setMontlyLimit.bind(this)}>Save</Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className='step'>Step 3</div>
                  <div id='step3' className="stepBox shadowbox">
                    {
                      this.state.charitiesSelected ? <div className='linked'>&#10004;</div> : null
                    }
                    <div className='stepText'>Select Your Charities</div>
                    <button onClick={this.scrollDown.bind(this)} className='scrollButton stepText'>&#9662;</button>
                  </div>
                </Col>
              </div>
            </Row>
          </Grid>

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
                    {this.state.newPasswordMatch ? null : <div className="matchError">Password's do not match</div>}
                    <Button className="modalButton" onClick={this.closePassword}>Cancel</Button>
                  </form>
                  </Modal.Body>
                </Modal>
              </div>

            <Row id='charities'>
              {
                this.state.charities.length ?
              <div className="userCharitiesContainer">
                <Button className='searchButton' href="/search" >Add</Button>
                <Button className='editButton' onClick={this.openEditCharitiesModal.bind(this)} >Edit</Button>
                <h1>Your Donation Breakdown</h1>
                <div className='userCharities'>
                {
                  this.state.charities.sort((a, b) => b.percentage - a.percentage).map(charity =>
                    <a href={'/' + charity.type + '/' + (charity.ein || charity.id)}>
                      <div className='userCharity'>
                        <div className='percentInfo'>
                          {charity.percentage*100} %
                        </div>
                        <div className='charityInfo'>
                          <div className='title'>{charity.name}</div>
                          {
                            (charity.goal_reached === '1') ?
                            <div className='goalReached'>&#10004; Goal Reached</div>
                            : null
                          }
                          <div className='amount'>${charity.user_donation_total}</div>
                          <div className='since'>{this.convertToReadableDate(charity.initial_date)}</div>
                        </div>
                      </div>
                    </a>
                    )
                }
                </div>
              </div>
              :
              <div className='charitiesBanner'>
                <div>Add a charity to start donating!</div>
                <Button className='startButton' href="/search">Search</Button>
              </div>
              }
            </Row>
            <Row>
              <div className='charitiesBanner'>
                <div>Doing some fundraising of your own? Add a custom cause and invite friends to help you meet your goal!</div>
                  <CustomCauseModal purpose='add' session={this.state.userSession} setCauses={this.setCustomCauses}/>
              </div>
            </Row>
            <Row>
            {
              this.state.customCauses.length ?
              <div className="userCharitiesContainer">
                <h1>Causes You've Started</h1>
                <div className='customCauses'>
                {
                  this.state.customCauses.map(cause =>
                      <div className='customCause'>
                        <div className='title'>
                          <a href={'/myCause/edit/' + cause.id} className='title'>{cause.charityName}</a>
                        </div>
                        <div className='contributors'>Number of Contributors:</div>
                        <div className='percentage'>{Math.floor((cause.total_donated/cause.dollar_goal)*100)}%</div>
                        <div className='amount'>$ {cause.total_donated} / {cause.dollar_goal}</div>
                      </div>
                    )
                }

                </div>
              </div>
              : null
            }
            </Row>
          {
            this.state.transactions.length ?
          <Grid>
            <Row >
              <Col className="userTransactionsContainer">
                <h1>Your Donation History</h1>
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
          : null
          }
        </div>

        <CharityModal
          show={this.state.showEditCharitiesModal}
          onHide={this.closeEditCharitiesModal.bind(this)}
          currentCharity={{}}
          updateProfile={this.updateCharities.bind(this)}
        />

        <div class="donationGraph">
          <AreaChart width={900} height={400} data={data2} syncId="anyId"
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Area type='monotone' dataKey='Donated' stroke='#82ca9d' fill='#82ca9d' />
          </AreaChart>
        </div>
      </Header>
    );
  }
}

export default UserProfile;
