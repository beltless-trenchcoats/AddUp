import React, { Component } from 'react';

class Transaction extends Component {
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