import React, { Component } from 'react';
// import { Col, Panel } from 'react-bootstrap';
import axios from 'axios';

import Header from './Header';

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileInfo: {},
      customCauses: {}
    }
  }

  componentWillMount () {
    axios.post('http://localhost:8080/api/user/info', {
      idOrEmail: this.props.params.id
    })
    .then((res) => {
      console.log('RES RES RES', res)
      this.setState ({
        profileInfo: res.data
      }, ()=> console.log('profileinfo', this.state.profileInfo))
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render () {
    console.log('customCauses', this.state.customeCauses);
    return (
      <Header>
        <div className="publicProfile">

        </div>
      </Header>
    )
  }
}

export default PublicProfile;
