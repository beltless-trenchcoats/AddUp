import React, { Component } from 'react';
import { Link } from 'react-router';
import { Row, Button, Jumbotron, Col, Panel } from 'react-bootstrap';
import axios from 'axios';
import { XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';

import server from '../../server/config/config';

import './App.scss';

import Header from './Header';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      totalDonated: 0,
      charityPieChartData: []
    }
  }

  componentWillMount() {
    axios.get(server + '/api/transactions/all')
    .then((res) => {
      var transactions = res.data;
      var daysData = {};
      var totalDonated = 0;
      transactions.forEach(function(elt) {
        var day = new Date(elt.date_time);
        var dayString = day.getMonth() + 1 + '/' + day.getFullYear();
        daysData[dayString] = daysData[dayString] + elt.amount || elt.amount;
        totalDonated += elt.amount;
      });
      totalDonated = Math.floor(totalDonated*100) / 100;
      this.setState({totalDonated: totalDonated});
      var data = [];
      for (var key in daysData) {
        if(key) {
          data.push({name: key, 'Amount Donated': daysData[key]});
        }
      }
      data.sort(function(a,b) {
        var bNum = Number(''+b.name.split('/')[1] + b.name.split('/')[0]);
        var aNum = Number(''+a.name.split('/')[1] + a.name.split('/')[0]);
        return (aNum - bNum);
      });
      this.setState({data: data});
    })
    .catch((err) => {
      console.log(err);
    });
  }



  render() {
    return (
      <Header>
        <div className="App">
          <div className="description">
            <Jumbotron className='jumbotron'>
              <h2>Make a Difference</h2>
              <p className="homePageSubtitle">Have a voice. Make a Difference. AddUp.</p>
              <p>Find and support charitable causes on your budget</p>
              <p><Link to="/search"><Button className='findButton' >Find Charities</Button></Link></p>
            </Jumbotron>
          </div>

          <div className="infoSections">

            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Find Charities and Causes" bsStyle="primary">
                <p>With over 1.5 million charities available to search through you can truly find a cause that you are passionate about, or create your own cause.</p>
              </Panel>
            </Col>

            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Securely Link your Accounts" bsStyle="primary">
                <p>Connect the accounts you already use everyday. We use Plaid and Stripe to securely link your accounts. We never store your account information.</p>
              </Panel>
            </Col>

            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Donate Your Change" bsStyle="primary">
                <p>Use your credit or debit card and we round-up your purchase to the nearest dollar. Set monthly limits so that you can ensure your donations fit your budget. </p>
              </Panel>
            </Col>

          </div>


        </div>
        <div className='graph'>
          <Row>
            <h2 className="chartLabel">AddUp users have donated ${this.state.totalDonated} to charities so far!</h2>
            <LineChart width={800} height={400} data={this.state.data}>
              <XAxis dataKey="name"/>
              <YAxis label="Dollars Donated" />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
              <Line type="monotone" dataKey="Amount Donated" stroke="#8884d8" />
            </LineChart>
            </Row>
            <h3 className="contributionTitle">How Your Contributions Help</h3>
            <img className="creditCardHand" role="presentation" src={require('../assets/images/creditCardHand.png')} />
            <img className="heartHandShake" role="presentation" src={require('../assets/images/Heart-hand-shake.png')} />
            <img className="coinStack" role="presentation" src={require('../assets/images/coinsStacking.png')} />

            <div className="impactSection">

              <Col xs={6} md={4} className="impactColumn">
                <Panel header="Every Month Your Change Can" bsStyle="primary" className="impactPanel">
                  <p>Protect 12 people from Malaria for three to four years, by giving to the <span className="emphasis">Against Malaria Foundation</span>.</p>
                </Panel>
              </Col>

              <Col xs={6} md={4} className="impactColumn">
                <Panel header="Every 6 Months Your Change Can" bsStyle="primary" className="impactPanel">
                  <p>Provide safe water to 142 community members for one year with <span className="emphasis">Evidence Action</span>.</p>
                </Panel>
              </Col>

              <Col xs={6} md={4} className="impactColumn">
                <Panel header="Every Year Your Change Can" bsStyle="primary" className="impactPanel">
                  <p>Provide school meal programs to 5 children for one year with <span className="emphasis">Oxfam</span>.</p>
                </Panel>
              </Col>

            </div>
        </div>
      </Header>
    );
  }
}

export default App;
