import React, { Component } from 'react';
import PlaidLinkComponent from './PlaidLink';

class UserProfile extends Component {
  render() {
    return (
      <div className="userProfile">
        <form id="some-id" method="POST" action="/authenticate"></form>
        <p className="App-intro">
         CHECK ON THE USER INFO
        </p>
        <PlaidLinkComponent />
      </div>
    );
  }
}

export default UserProfile;
