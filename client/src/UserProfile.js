
import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';
import { Col, Row, Grid, Table, Button, FormControl } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import $ from "jquery";
import cookie from 'react-cookie';
import fileDownload from 'react-file-download';

import server from '../../server/config/config';

import Header from './Header';
import Transaction from './Transaction';
import CharityModal from './CharityModal';
import PhotoUploader from './PhotoUploader';
import CustomCauseModal from './CustomCauseModal';
import ChangeEmailModal from './ChangeEmailModal';
import ChangePasswordModal from './ChangePasswordModal';

let transactionChartData = [];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FEB4D5','#FBFF28'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
    	{`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

let charityPieChartData = [];

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
      showEditCharitiesModal: false,
    }
    this.setCustomCauses = this.setCustomCauses.bind(this);
    this.setSession = this.setSession.bind(this);
    this.downloadTransactions = this.downloadTransactions.bind(this);
  }

  componentWillMount() {
    // if (this.props.location.query.code) {
    //   axios.post(server + '/oauth/callback', {
    //     code: this.props.location.query.code
    //   })
    //   .then(res => {
    //     console.log('stripe info', res.data);
    //   });
    // }
    var cookieSession = {
      email: cookie.load('email'),
      firstName: cookie.load('firstname'),
      lastName: cookie.load('lastname')
    };
    // axios.get('http://localhost:8080/api/session')
    // .then(res => {
    this.setState({
      userSession: cookieSession
    });

    var email = cookie.load('email');

    axios.post(server + '/api/user/info', {
      'idOrEmail': email
      })
      .then(res => {
        console.log('userInfo', res.data)
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
          var userSession = this.state.userSession;
          userSession.id = res.data.id;
          this.setState({userSession: userSession});
          axios.post(server + '/api/charities/search', {
            'id_owner': res.data.id,
            'type': 'Custom Cause'
            })
            .then(response => {
              if (response.data) {
                this.setState({customCauses: response.data});
              }
            });
        });

      axios.post(server + '/api/user/transactions', {
          'email': email
        })
        .then(res => {
          this.setState({transactions: res.data});
            var months = [];
            var January = {'date': 'January', 'Donated': 0 };
            var February = {'date': 'February', 'Donated': 0 };
            var March = {'date': 'March', 'Donated': 0 };
            var April = {'date': 'April', 'Donated': 0 };
            var May = {'date': 'May', 'Donated': 0 };
            var June = {'date': 'June', 'Donated': 0 };
            var July = {'date': 'July', 'Donated': 0 };
            var August = {'date': 'August', 'Donated': 0 };
            var September = {'date': 'September', 'Donated': 0 };
            var October = {'date': 'October', 'Donated': 0 };
            var November = {'date': 'November', 'Donated': 0 };
            var December = {'date': 'December', 'Donated': 0 };
          for(var i = 0; i < 1; i++) {
            res.data.map( (transaction) => {
              var newDate = transaction.date_time.split('T');
              var newMonth = newDate[0].split('-');
              if(newMonth[1] === '01') {
                January['Donated'] += transaction.amount;
              } else if(newMonth[1] === '02') {
                February['Donated'] += transaction.amount;
              } else if(newMonth[1] === '02') {
                March['Donated'] += transaction.amount;
              } else if(newMonth[1] === '04') {
                April['Donated'] += transaction.amount;
              } else if(newMonth[1] === '05') {
                May['Donated'] += transaction.amount;
              } else if(newMonth[1] === '06') {
                June['Donated'] += transaction.amount;
              } else if(newMonth[1] === '07') {
                July['Donated'] += transaction.amount;
              } else if(newMonth[1] === '08') {
                August['Donated'] += transaction.amount;
              } else if(newMonth[1] === '09') {
                September['Donated'] += transaction.amount;
              } else if(newMonth[1] === '10') {
                October['Donated'] += transaction.amount;
              } else if(newMonth[1] === '11') {
                November['Donated'] += transaction.amount;
              } else {
                December['Donated'] += transaction.amount;
              }
            })
            January['Donated'] = Math.floor(January['Donated'] * 100) / 100;
            February['Donated'] = Math.floor(February['Donated'] * 100) / 100;
            March['Donated'] = Math.floor(March['Donated'] * 100) / 100;
            April['Donated'] = Math.floor(April['Donated'] * 100) / 100;
            May['Donated'] = Math.floor(May['Donated'] * 100) / 100;
            June['Donated'] = Math.floor(June['Donated'] * 100) / 100;
            July['Donated'] = Math.floor(July['Donated'] * 100) / 100;
            August['Donated'] = Math.floor(August['Donated'] * 100) / 100;
            September['Donated'] = Math.floor(September['Donated'] * 100) / 100;
            October['Donated'] = Math.floor(October['Donated'] * 100) / 100;
            November['Donated'] = Math.floor(November['Donated'] * 100) / 100;
            December['Donated'] = Math.floor(December['Donated'] * 100) / 100;

            months.push(January);
            months.push(February);
            months.push(March);
            months.push(April);
            months.push(May);
            months.push(June);
            months.push(July);
            months.push(August);
            months.push(September);
            months.push(October);
            months.push(November);
            months.push(December);
          }
          for(var j = 0; j < months.length; j++) {
            transactionChartData.push({ 'Date': months[j].date, 'Donated': months[j].Donated })
          }
        });

      axios.post(server + '/api/user/charities/info', {
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
        res.data.map( (charity) => {
          if(charity.percentage > 0) {
            charityPieChartData.push({'name': charity.name, 'value': charity.percentage})
          }
        })
      });
    // })
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

  updateCharities(charities) {
    this.setState({charities: charities});
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
    if (this.state.newMonthlyLimit > 0) {
      $('#limitInput').removeClass('invalidLimit');
      axios.post(server + '/api/user/update', {
        email: this.state.userSession.email,
        limit: this.state.newMonthlyLimit
      }).then(() => {
        $('#step2').removeClass('incomplete');
        this.setState({
          monthlyLimit: this.state.newMonthlyLimit,
          monthlyLimitSet: true
        });
      });
    } else {
      $('#limitInput').addClass('invalidLimit');
    }
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

  downloadTransactions () {
    let transactionTableData = [['Date', 'Amount', 'Recipient Charity']]
    this.state.transactions.forEach((transaction) => transactionTableData.push('\n'+[new Date(transaction.date_time).toLocaleDateString(), transaction.amount, transaction.name]))
    console.log('transactionTable', JSON.parse(JSON.stringify(transactionTableData)))
    fileDownload(JSON.parse(JSON.stringify(transactionTableData)), 'AddUp-Transaction-History.csv')
  }

  render() {
    return (
      <Header>
        <div className="profilePage">
            <Row className='lessPadding'>
              <div className="userProfile">
                <Col xs={7} md={7}>
                    <div className='welcome'>Welcome, {this.state.userSession.firstName} {this.state.userSession.lastName}</div>
                    <div className='profileField'>
                      <span className='label'>Email:</span>
                      <span className='value'> {this.state.userSession.email}</span>
                      <ChangeEmailModal session={this.state.userSession} setSession={this.setSession}/>
                    </div>
                    <div className='profileField'>
                      <span className='label'>Password:</span>
                      <span className='value'>*******</span>
                      <ChangePasswordModal session={this.state.userSession}/>
                    </div>
                    <div className='profileField'>
                      <span className='label'>Monthly Limit: </span>
                      {this.state.monthlyLimit ? $ : null}
                      <span className='value'>$ {this.state.monthlyLimit}</span>
                    </div>
                </Col>
                <Col xs={3} md={3}>
                  <PhotoUploader user={this.state.userInfo}/>
                </Col>
              </div>
            </Row>
          <Grid>
            <Row>
              <div className='profileOptions'>
                <Col md={4} xs={4}>
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
                <Col md={4} xs={4}>
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
                <Col md={4} xs={4}>
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

            <Row id='charities'>
              {
                this.state.charities.length ?
              <div className="userCharitiesContainer">
                <Button className='searchButton' href="/search" >Add</Button>
                <Button className='editButton' onClick={this.openEditCharitiesModal.bind(this)} >Edit</Button>
                <h1>Your Donation Breakdown</h1>
                <PieChart width={500} height={350} onMouseEnter={this.onPieEnter} className="pieChart">
                  <Pie
                    data={charityPieChartData}
                    cx={150}
                    cy={150}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                  >
                    {charityPieChartData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)}
                  </Pie>
                </PieChart>
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
              {//for adding stripe in the future <Col>
                //<a href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_9bfGnqU5JGVlcbNEJfmcmCCDAewlhQP7&scope=read_write" class="stripe-connect"><span>Connect with Stripe</span></a>
             // </Col>
              }
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
                  <Table responsive striped hover id="transactionTable">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Recipient</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.transactions.map ((transaction, i) => (
                          // transactionTableData.push([transaction.date_time, transaction.amount, transaction.name]),
                          <Transaction key={i} transaction={transaction} /> 
                        )
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <button onClick={this.downloadTransactions}>Download Transaction History</button>
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

        <div className="donationGraph">
          <AreaChart width={900} height={400} data={transactionChartData} syncId="anyId"
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey="Date"/>
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
