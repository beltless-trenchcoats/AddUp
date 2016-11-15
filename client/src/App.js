import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Jumbotron, Col, Panel } from 'react-bootstrap';

import homeImage from '../public/background.jpg'
import './App.css';

import Header from './Header';

class App extends Component {
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
      </Header>
    );
  }
}

export default App;
