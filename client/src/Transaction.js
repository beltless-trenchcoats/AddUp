import React, { Component } from 'react';
// import { Col, Row, Grid, Table } from 'react-bootstrap';
// import axios from 'axios';


class Transaction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  render() {
    return (
      <tr>
        <td>{this.props.info.date_time}</td>
        <td>${this.props.info.amount}</td>
        <td>Charity Name</td>

      </tr>
      
    );
  }
}

export default Transaction;