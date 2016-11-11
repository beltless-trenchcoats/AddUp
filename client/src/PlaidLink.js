import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class PlaidLinkComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      plaidData: [],
      account_id: '',
      public_token: ''
    }
  }

  handleOnSuccess(token, metadata) {
    this.setState({plaidData: metadata, account_id: metadata.account_id, public_token: token});
    console.log('account id', this.state.account_id);
    console.log('token', this.state.public_token);

    axios.post('http://localhost:8080/authenticate', {"public_token": this.state.public_token});
  }

  render() {
    return (
      <div>
        <PlaidLink
          publicKey="37a8ddc07995ddb90ea7fae3a54e06"
          product="auth"
          env="tartan"
          clientName="AddUp"
          selectAccount={true}
          onSuccess={this.handleOnSuccess.bind(this)}
          />
      </div>
    );
  }
}

export default PlaidLinkComponent;
