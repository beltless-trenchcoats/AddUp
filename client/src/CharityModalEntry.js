import React, { Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
// import Promise from 'react-promise'

class CharityModalEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: 'primary',
      remove: false,
      charityId: this.props.charity.id,
      name: this.props.charity.name,
      totalDonated: this.props.charity.total_donated,
      percentage: this.props.charity.percentage,
      firstClick: true
    }
    this.prepForRemove = this.prepForRemove.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount () {
    this.props.updateTotal.call(null, this.state.percentage)
  }

  prepForRemove () {
    var e = {target: {value: 0}}
    this.state.style === 'primary' ? this.setState({ style: 'danger' }) : this.setState({ style: 'primary' })
    this.setState({ remove: !this.state.remove }, () => this.handleChange(e));
  }

  handleChange (e) {
    let updatedValue = Number(e.target.value)
    let lastValue = this.state.percentage
    this.setState({ percentage: updatedValue })
    if (this.state.firstClick) {
      this.setState({firstClick : false})
      this.props.updateTotal.call(null, -lastValue)
      this.props.updateTotal.call(null, updatedValue)
    } else {
      updatedValue <= lastValue ? this.props.updateTotal.call(null, updatedValue-lastValue) : this.props.updateTotal.call(null, updatedValue-lastValue)
    }
    this.props.save(this.props.index, this.state.charityId, this.state.remove, updatedValue);
  }

  render() {
    return ( 
      <tr>
        <td>{this.props.charity.name}</td>
        <td>${this.props.charity.total_donated || 0}</td>
        <td>
          <FormControl componentClass="select" onChange={this.handleChange} disabled={this.state.remove}>
            <option value={this.state.percentage}>{(this.state.percentage*100) + '%'}</option>
            <option value="1">100%</option>
            <option value="0.9">90%</option>
            <option value="0.8">80%</option>
            <option value="0.7">70%</option>
            <option value="0.6">60%</option>
            <option value="0.5">50%</option>
            <option value="0.4">40%</option>
            <option value="0.3">30%</option>
            <option value="0.2">20%</option>
            <option value="0.1">10%</option>
            <option value="0">0%</option>
          </FormControl>
        </td>
        <td><Button bsStyle={this.state.style} onClick={this.prepForRemove}>Remove</Button></td>
      </tr>

    );
  }
};

export default CharityModalEntry;
 