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
              <p>Find and support charitable causes on your budget</p>
              <p><Link to="/search"><Button bsStyle="primary">Find Charities</Button></Link></p>
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

            <div className="footer">
              <p><Link to="/about"><Button bsStyle="primary">About Us</Button></Link></p>
              <p><Link to="/contact"><Button bsStyle="primary">Contact Us</Button></Link></p>
            </div>

          </div>


        </div>
      </Header>
    );
  }
}

export default App;
