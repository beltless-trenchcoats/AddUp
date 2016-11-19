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
          <div className="contactUsSection">

            <Col xs={6} md={4} className="infoColumn">
              <Panel header="Contact Us" bsStyle="primary">
                <p>Email: support@addUp.com</p>
              </Panel>
            </Col>
          </div>
        </div>
      </Header>
    )
  }
}

export default Contact;
