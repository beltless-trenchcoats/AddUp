import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class PlaidLinkComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      plaidData: [],
      account_id: '',
      public_token: '',
      institution_name: ''
    }
    this.handleOnSuccess = this.handleOnSuccess.bind(this)
  }

  handleOnSuccess(token, metadata) {
    this.setState({
      plaidData: metadata, 
      account_id: metadata.account_id, 
      public_token: token,
      institution_name: metadata.institution.name
    });

    axios.post('http://localhost:8080/authenticate',
      {'account_id': this.state.account_id,
        'public_token': this.state.public_token,
        'institution_name': this.state.institution_name
      });
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
          onSuccess={this.handleOnSuccess}
          />
      </div>
    );
  }
}

export default PlaidLinkComponent;
