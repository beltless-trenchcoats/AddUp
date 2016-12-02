import React, { Component } from 'react';
//This line allows us to use underscore-style variable names
/* eslint-disable camelcase */

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