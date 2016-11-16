import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap'
// import axios from 'axios';

class CharitySearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      charityId: this.props.info.ein
    }
  }

  render() {
    return (
     <div>
     {/* {console.log("charity", this.props.info)} */}
      <Panel className="charityCard" header={<a href={"/charity/" + this.state.charityId}>{this.props.info.charityName}</a>} bsStyle="info">
        <p className="category">{this.props.info.category}</p>
        <p className="missionStatement"><span className="missionStatementTitle">Mission Statement: </span>{this.props.info.missionStatement}</p>
        <p className="location">{this.props.info.city}, {this.props.info.state}</p>
        <p className="website">{this.props.info.website}</p>
        <a href={"/charity/" + this.state.charityId}><Button bsStyle="primary">Learn More and Donate</Button></a>
      </Panel>
     </div>
    );
  }
}

export default CharitySearchResult;

//<a href="/charity/"+this.state.charityId>this.props.info.charityName</a>
