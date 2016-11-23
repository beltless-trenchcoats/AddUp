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
        <div className="aboutUsSection">
          <div className='about'>
            <div>AddUp++ aggregates charitable donations through automatic
            micropayments by rounding up each credit or debit transaction
            to the next dollar and sending the difference to a charity of your
            choice. Discover and select from any IRS-recognized charitable
            organization or user-generated crowd-funding initiative. Alleviate
            any financial concerns by setting monthly donation limits, and track
            your donation history with our mobile app.
            </div>
          <Link to="/contact"><button className="aboutButton">Contact Us</button></Link>
          </div>
        </div>
      </Header>
    )
  }
}

export default About;
