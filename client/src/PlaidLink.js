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
