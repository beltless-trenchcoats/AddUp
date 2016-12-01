import React, { Component } from 'react';
// import { Col, Row, Grid, Table } from 'react-bootstrap';
// import axios from 'axios';


class Donation extends Component {

  convertToReadableDate(date_time) {
    var date = new Date(date_time);
    return date.toLocaleDateString();
  }

  render() {
    return (
      <tr>
        <td>{this.convertToReadableDate(this.props.donation.date_time)}</td>
        <td>${this.props.donation.amount}</td>
        <td>{this.props.donation.first_name + ' ' + this.props.donation.last_name}</td>
      </tr>
      
    );
  }
}

export default Donation;