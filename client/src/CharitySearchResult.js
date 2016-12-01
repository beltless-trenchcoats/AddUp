import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';

class CharitySearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      charityId: this.props.info.ein || Number(this.props.info.id),
      type: this.props.info.type || 'charity'
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      charityId: nextProps.info.ein || Number(nextProps.info.id),
      type: nextProps.info.type || 'charity'
    });
  }

  render() {
    return (
     <div>
     {/* {console.log("charity", this.props.info)} */}
      <Panel className="charityCard" header={<a href={"/" + this.state.type + '/' + this.state.charityId}>{this.props.info.charityName}</a>} bsStyle="info">
        <p className="category">{this.props.info.category}</p>
        <p className="missionStatement"><span className="missionStatementTitle">Mission Statement: </span>{this.props.info.missionStatement}</p>
        <p className="location">{this.props.info.city}, {this.props.info.state}</p>
        <p className="website">{this.props.info.website}</p>
        <Link to={{pathname: "/" + this.state.type + '/' + this.state.charityId, state:{searched: true}}}><Button bsStyle="primary">Learn More and Donate</Button></Link>
      </Panel>
     </div>
    );
  }
}

export default CharitySearchResult;
