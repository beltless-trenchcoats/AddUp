import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import Header from './Header';

class CharityProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charityId: this.props.charityId
    }
  }

  ComponentDidMount () {
    console.log('hello')
    // axios.post('http://localhost:8080/charityInfo', {
    //   charityId: this.state.charityId
    // })
    // .then((res) => {
    //   console.log("hello")
    //   console.log(res)
    //   this.setState({})
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
  }

  render() {
    return (
      <Header>
        <div className="charityProfilePage">
          <h1>Charity Profile</h1>
          <h3> Email: </h3>
          <h3> Total Donations to Date: </h3>

          <Button></Button>
        </div>
      </Header>
    );
  }
}

export default CharityProfilePage;
