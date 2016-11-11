import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Jumbotron, Col, Panel } from 'react-bootstrap';

import logo from './logo.svg';
import homeImage from '../public/background.jpg'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="name">AddUp+</div>
        </div>

        <div className="imageDiv">
          <img src={homeImage} className="homeImage" alt="home" />
          <Jumbotron className='jumbortron'>
            <h2>Make a Difference</h2>
            <p className="homePageSubtitle">Have a voice. Make a Difference. AddUp.</p>
            <p>Find a support charitable causes on your budget</p>
            <p><Button bsStyle="primary">Find Charities</Button></p>
          </Jumbotron>
        </div>

        <div className="infoSections">
          
            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Find Charities and Causes" bsStyle="primary">
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis natoque penatibu</p>
                <Link to="/user"><Button bsStyle="primary">Check for User</Button></Link>
              </Panel>
            </Col>

          <Col xs={6} md={4} className="infoColumn">
            <Panel header="Securely Link your Accounts" bsStyle="primary">
              <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis natoque penatibu</p>
              <Link to="/user"><Button bsStyle="primary">Check for User</Button></Link>
            </Panel>
          </Col>

          <Col xs={6} md={4} className="infoColumn">
            <Panel header="Set Monthly Limits" bsStyle="primary">
              <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis natoque penatibu</p>
              <Link to="/user"><Button bsStyle="primary">Check for User</Button></Link>
            </Panel>
          </Col>
        </div>
      </div>
    );
  }
}

export default App;
