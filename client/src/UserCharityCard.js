import React, { Component } from 'react';

//This line allows us to use underscore-style variable names
/* eslint-disable camelcase */

class UserCharityCard extends Component {
  convertToReadableDate(date_time) {
    var date = new Date(date_time);
    if (date.getFullYear() < 2015) { //if the user hasn't donated yet, it returns default date from 1960s (don't want to display)
      return 'No Donations On File';
    }
    var options = {
      month: 'short',
      year: 'numeric',
      day: 'numeric'
    };
    return 'since ' + date.toLocaleDateString('en-us', options);
  }
  
  render() {
    return (
      <a href={'/' + this.props.charity.type + '/' + (this.props.charity.ein || this.props.charity.id)}>
        <div className='userCharity'>
          <div className='percentInfo'>
            {this.props.charity.percentage * 100} %
          </div>
          <div className='charityInfo'>
            <div className='title'>{this.props.charity.name}</div>
            {
              (this.props.charity.goal_reached === '1') ?
              <div className='goalReached'>&#10004; Goal Reached</div>
              : null
            }
            <div className='amount'>${this.props.charity.user_donation_total}</div>
            <div className='since'>{this.convertToReadableDate(this.props.charity.initial_date)}</div>
          </div>
        </div>
      </a> 
    );
  }
}

export default UserCharityCard;


