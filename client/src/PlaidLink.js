import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class PlaidLinkComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      plaidData: {},
      public_token: ''
    }
    this.handleOnSuccess = this.handleOnSuccess.bind(this)
  }

  handleOnSuccess(token, metadata) {
    this.setState({
      plaidData: metadata,
      public_token: token
    });
    console.log('public token', token);
    //159b666f84c9ee57b1c4b4e2af5ff5075c72c09feea27a98092c2a39a08cd9db1ffb1b0041edabfcefb7fdcde634966b0956122efa3f5a2fd59bbc7bb0faf5ed
    //159b666f84c9ee57b1c4b4e2af5ff50752ce82453e4fb147bbf5a3733b526dc0c36d258f6fe48bb416256dfd05d50b50a502e45a59df646770a683088bc305c6

    axios.post('http://localhost:8080/api/plaid/authenticate',
      {'account_id': this.state.plaidData.account_id,
        'public_token': this.state.public_token,
        'institution_name': this.state.plaidData.institution.name
      })
    .then((resp) => {
      this.props.successFunc(this.state.plaidData.institution.name, resp.data);
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
