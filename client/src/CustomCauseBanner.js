import React, { Component } from 'react';

class CustomCauseBanner extends Component {
  render() {
    return (
      <div className='customCause'>
        <div className='title'>
          <a href={'/myCause/edit/' + this.props.cause.id} className='title'>{this.props.cause.charityName}</a>
        </div>
        <div className='contributors'>Number of Contributors:</div>
        <div className='percentage'>{Math.floor((this.props.cause.total_donated / this.props.cause.dollar_goal) * 100)}%</div>
        <div className='amount'>$ {this.props.cause.total_donated} / {this.props.cause.dollar_goal}</div>
      </div>
    );
  }
}

export default CustomCauseBanner;