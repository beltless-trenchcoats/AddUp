import React, { Component } from 'react';
import Header from './Header';


class About extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render () {
    return (
      <Header>
        <div>
          <p>hello world</p>
        </div>
      </Header>
    )
  }
}

export default About;
