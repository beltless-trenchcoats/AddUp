import React, { Component } from 'react';
import { Panel } from 'react-bootstrap'
// import axios from 'axios';

class CharitySearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      charityId: this.props.info.ein
    }
  }

  componentWillMount () {
    console.log('props', this.props)
  }

  render() {
    return (
     <div>
      <Panel className="charityCard" header={this.props.info.charityName} bsStyle="info">
        <p className="category">{this.props.info.category}</p>
        <p className="missionStatement"><span className="missionStatementTitle">Mission Statement: </span>{this.props.info.missionStatement}</p>
        <p className="location">{this.props.info.city}, {this.props.info.state}</p>
        <p className="website">{this.props.info.website}</p>
      </Panel>
     </div>
    );
  }
}

export default CharitySearchResult;


acceptingDonations:1
category:"Health - General and Rehabilitative"
charityName:"PLANNED PARENTHOOD PASADENA AND SAN GABRIEL VALLEY INC"
city:"ALTADENA"
deductibilityCd:1
donationUrl:"http://donate.makemydonation.org/donate/951916050"
ein:"951916050"
eligibleCd:1
missionStatement:""
recordCount:943
rows:20
score:9.924065
start:0
state:"California"
statusCd:1
url:"http://www.orghunter.com/organization/951916050"
website:""
zipCode:"91001-2463"