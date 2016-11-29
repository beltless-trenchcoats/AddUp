import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap'

class CharitySearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      charityId: this.props.info.ein || Number(this.props.info.id),
      type: this.props.info.type || 'charity'
    }
  }

  render() {
    return (
     <div>
     {/* {console.log("charity", this.props.info)} */}
<<<<<<< HEAD
      <Panel className="charityCard" header={<a href={"/" + this.state.type + '/' + this.state.charityId}>{this.props.info.charityName}</a>} bsStyle="info">
        <p className="category">{this.props.info.category}</p>
=======
      <Panel className="charityCard" header={<a href={"/" + this.state.type + '/' + this.props.info.ein}>{this.props.info.charityName}</a>} bsStyle="info">
        <p className="category">{this.props.info.category + ' type:' + this.props.info.type}</p>
>>>>>>> pagination clicks work
        <p className="missionStatement"><span className="missionStatementTitle">Mission Statement: </span>{this.props.info.missionStatement}</p>
        <p className="location">{this.props.info.city}, {this.props.info.state}</p>
        <p className="website">{this.props.info.website}</p>
        <a href={"/" + this.state.type + '/' + this.props.info.ein}><Button bsStyle="primary">Learn More and Donate</Button></a>
      </Panel>
     </div>
    );
  }
}

export default CharitySearchResult;
