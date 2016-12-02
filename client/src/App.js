import React, { Component } from 'react';
import { Link } from 'react-router';
import { Row, Button, Jumbotron, Col, Panel } from 'react-bootstrap';
import axios from 'axios';
import { XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';
import $ from 'jquery';

import server from '../../server/config/config';

import './App.scss';

import Header from './Header';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      totalDonated: 0,
      charityPieChartData: []
    };
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
      totalDonated = Math.floor(totalDonated * 100) / 100;
      this.setState({totalDonated: totalDonated});
      var data = [];
      for (var key in daysData) {
        if (key) {
          data.push({name: key, 'Amount Donated': daysData[key]});
        }
      }
      data.sort(function(a, b) {
        var bNum = Number('' + b.name.split('/')[1] + b.name.split('/')[0]);
        var aNum = Number('' + a.name.split('/')[1] + a.name.split('/')[0]);
        return (aNum - bNum);
      });
      this.setState({data: data});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {
    $(window).scroll(() => $('.App').css('opacity', 1 - $(window).scrollTop() / 500) );
  }

  render() {
    return (
      <Header>
        <div className="App">
          <div className="description">
            <div className='siteTitle'>AddUp++</div>
            <div className='tagline'>Have a voice. Make a Difference. AddUp.</div>
          </div>
        </div>
        <div className="infoSections">
          <Col xs={6} md={4} className="infoColumn">
            <img className="infoIcon" role="presentation" src={require('../assets/images/Heart-hand-shake.png')} />
            <p className='title'>Find Charities and Causes</p>
            <p>With over 1.5 million charities available to search through you can truly find a cause that you are passionate about, or create your own cause.</p>
          </Col>

          <Col xs={6} md={4} className="infoColumn">
            <img className="infoIcon" role="presentation" src={require('../assets/images/creditCardHand.png')} />
            <p className='title'>Securely Link your Accounts</p>
            <p>Connect the accounts you already use everyday. We use Plaid and Stripe to securely link your accounts. We never store your account information.</p>
          </Col>

          <Col xs={6} md={4} className="infoColumn">
            <img className="infoIcon" role="presentation" src={require('../assets/images/coinsStacking.png')} />
            <p className='title'>Donate Your Change</p>
            <p>Use your credit or debit card and we round-up your purchase to the nearest dollar. Set monthly limits so that you can ensure your donations fit your budget. </p>
          </Col>

        </div>
        <div className='impactSection'>
          <div className='contributionTitle'>How Your Contributions Help</div>
          <div className='impactColumn'>
            <div className='impact'>
              <p className='title'>In <span className='emTime'>one month</span> your change can...</p>
              <p>Protect <span className='emFact'>12 people</span> from <span className='emFact'>Malaria</span> for three to four years, by giving to the <span className='emCharity'>Against Malaria Foundation</span>.</p>
            </div>
            <div className='impact'>
              <p className='title'>In <span className='emTime'>six months</span> your change can...</p>
              <p>Provide <span className='emFact'>safe water</span> to <span className='emFact'>142 community members</span> for one year with <span className='emCharity'>Evidence Action</span>.</p>
            </div>
            <div className='impact'>
              <p className='title'>In <span className='emTime'>one year</span> your change can...</p>
              <p>Provide <span className='emFact'>school meal programs</span> to <span className='emFact'>5 children</span> for one year with <span className='emCharity'>Oxfam</span>.</p>
            </div>
          </div>
        </div>
        <div className='graph'>
          <Row>
            <h2 className='chartLabel'>AddUp users have donated ${this.state.totalDonated} to charities so far!</h2>
            <LineChart width={800} height={400} data={this.state.data}>
              <XAxis dataKey='name'/>
              <YAxis label='Dollars Donated' />
              <CartesianGrid stroke='#eee' strokeDasharray='5 5'/>
              <Line type='monotone' dataKey='Amount Donated' stroke='#8884d8' />
            </LineChart>
          </Row>
        </div>
      </Header>
    );
  }
}

export default App;
