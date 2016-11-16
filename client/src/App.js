import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Jumbotron, Col, Panel } from 'react-bootstrap';
import axios from 'axios';

import homeImage from '../public/background.jpg'
import './App.css';

import Header from './Header';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userSession: {}
    }
  }

  componentWillMount() {
    axios.get('http://localhost:8080/userSession')
    .then((res) => {
      console.log('userSession', res.data);
      this.setState({
        userSession: res.data
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <Header>
        <div className="App">

          <div className="imageDiv">
            <img src={homeImage} className="homeImage" alt="home" />
            <Jumbotron className='jumbotron'>
              <h2>Make a Difference</h2>
              <p className="homePageSubtitle">Have a voice. Make a Difference. AddUp.</p>
              <p>Find a support charitable causes on your budget</p>
              <p><Link to="/search"><Button bsStyle="primary">Find Charities</Button></Link></p>
            </Jumbotron>
          </div>

          <div className="infoSections">
          
            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Find Charities and Causes" bsStyle="primary">
                <p>Find your perfect charity with over 92357923875 to choose from.</p>
              </Panel>
            </Col>

            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Securely Link your Accounts" bsStyle="primary">
                <p>We use Plaid and Stripe to securely link your accounts. We never store your account information.</p>
              </Panel>
            </Col>

            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Set Monthly Limits" bsStyle="primary">
                <p>Set monthly donation limits so you don't have to worry about going overboard.</p>
              </Panel>
            </Col>

          </div>

        </div>
      </Header>
    );
  }
}

export default App;
