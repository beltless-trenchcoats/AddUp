import React, { Component } from 'react';
// import { Col, Row, Grid, Table } from 'react-bootstrap';
// import axios from 'axios';


class Transaction extends Component {
  // constructor(props) {
  //   super(props)
  // }

  convertToReadableDate(date_time) {
    var date = new Date(date_time);
    return date.toLocaleDateString();
  }

  render() {
    return (
      <tr>
        <td>{this.convertToReadableDate(this.props.transaction.date_time)}</td>
        <td>${this.props.transaction.amount}</td>
        <td>{this.props.transaction.name}</td>
      </tr>
      
    );
  }
}

export default Transaction;