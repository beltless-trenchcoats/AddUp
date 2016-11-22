import React, { Component } from 'react';
import { Button, Jumbotron, Col, Panel } from 'react-bootstrap';
import Header from './Header';
import './App.css';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render () {
    return (
      <Header>
        <div>
          <img src={require('../public/ocean.jpg')} className="contactPhoto" />
          <div className="contactUsSection">

            <Col xs={12} md={6} className="infoColumn">
              <Panel header="Contact Us" bsStyle="primary">
                <p>Email: support@AddUp.com
                   Phone: 510-555-5555
                   Address: 944 Market St. San Francisco, CA 94102
                </p>
              </Panel>
            </Col>
          </div>
        </div>
      </Header>
    )
  }
}

export default Contact;
