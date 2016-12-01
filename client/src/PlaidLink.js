import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';
import server from '../../server/config/config';
import helpers from '../helpers';

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

    var cookies = helpers.parseCookie(document.cookie);
    console.log('email', cookies.email);

    axios.post(server + '/api/plaid/authenticate',
      {'account_id': this.state.plaidData.account_id,
        'public_token': this.state.public_token,
        'institution_name': this.state.plaidData.institution.name,
        'email': cookies.email
      })
    .then((resp) => {
      console.log('this worked', resp.data);
      this.props.successFunc(this.state.plaidData.institution.name, resp.data);
    });
  }
  
  componentDidMount() {
    this.props.fixStylingFunc();
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
