import React, { Component } from 'react';
import { Link } from 'react-router';
import { Row, Button, Jumbotron, Col, Panel } from 'react-bootstrap';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, LineChart, Line, Legend, Bar, CartesianGrid, Tooltip, BarChart} from 'recharts';

import './App.css';

import Header from './Header';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userSession: {},
      data: []
    }
  }

  componentWillMount() {
    axios.get('http://localhost:8080/api/session')
    .then((res) => {
      console.log('userSession', res.data);
      this.setState({
        userSession: res.data
      })
    })
    .catch((err) => {
      console.log(err);
    });

    axios.get('http://localhost:8080/api/transactions/all')
    .then((res) => {
      // var data = res.data.map(function(elt) {
      //   return {name: elt.name, total_donated: elt.total_donated, category: elt.category};
      // });
      // this.setState({data: data});
      console.log('all', res.data);
      var transactions = res.data;
      var daysData = [];
      transactions.forEach(function(elt) {
        var day = new Date(elt.date_time);
        var dayString = day.getMonth() + 1 +'/' + day.getDate() + '/' + day.getFullYear();
        console.log(dayString, elt.date_time);
        daysData[dayString] = daysData[dayString] + elt.amount || elt.amount;
      });
      var data = [];
      for (var key in daysData) {
        data.push({name: key, amount: daysData[key]});
      }
      console.log('daysData', data);
      this.setState({data: data});
      // this.setState({
      //   userSession: res.data
      // })
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


            <Row>
              <LineChart width={600} height={400} data={this.state.data}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </Row>
            <div className="footer">
              
            </div>

          </div>


        </div>
        <div className='graph'>
        </div>
      </Header>
    );
  }
}

export default App;
