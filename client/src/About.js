import React, { Component } from 'react';
import { Button, Col, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import Header from './Header';
import './App.css';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render () {
    return (
      <Header>
        <img src={require('../public/sky_resized-min.png')} alt="About Page" className="aboutPhoto"/>
        <div>
          <div className="aboutUsSection">

            <Col xs={6} md={8} className="infoColumn">
              <Panel header="About Us!" bsStyle="primary">
                <p>AddUp++ aggregates charitable donations through automatic
                    micropayments by rounding up each credit or debit transaction
                    to the next dollar and sending the difference to a charity of your
                    choice. Discover and select from any IRS-recognized charitable
                    organization or user-generated crowd-funding initiative. Alleviate
                    any financial concerns by setting monthly donation limits, and track
                    your donation history with our mobile app.
                </p>
              </Panel>
              <Link to="/contact"><Button className="aboutButton">Contact Us</Button></Link>
            </Col>
          </div>
        </div>
      </Header>
    )
  }
}

export default About;
