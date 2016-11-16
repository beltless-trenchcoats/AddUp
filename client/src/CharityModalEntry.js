import React, { Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';

class CharityModalEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  conponentWillMound () {

    console.log(this.props)
  }

  render() {
    return ( 
      <tr>
        <td>{this.props.charity.name}</td>
        <td>${this.props.charity.total_donated || 0}</td>
        <td>
          <FormControl componentClass="select" placeholder={this.props.charity.percentage*100 + '%'}>
            <option value="select">100%</option>
            <option value="other">90%</option>
            <option value="select">80%</option>
            <option value="other">70%</option>
            <option value="select">60%</option>
            <option value="other">50%</option>
            <option value="select">40%</option>
            <option value="other">30%</option>
            <option value="select">20%</option>
            <option value="other">10%</option>
            <option value="select">0%</option>
          </FormControl>
        </td>
        <td><Button bsStyle="primary">Remove</Button></td>
      </tr>

    );
  }
};

export default CharityModalEntry;