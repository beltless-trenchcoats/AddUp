import React, { Component } from 'react';
import { Button, Grid, Col, Row } from 'react-bootstrap';
import { Gmaps, Marker } from 'react-gmaps';
import axios from 'axios';

import apiKeys from '../../server/config/API_Keys';
import Header from './Header';

class CharityProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charityId: this.props.params.id,
      charity: {},
      selected: false
    }
  }

  componentDidMount () {
    axios.post('http://localhost:8080/charityInfo', {
      charityId: this.state.charityId
    })
    .then((res) => {
      console.log('response', res.data)
      this.setState({charity: res.data})
    })
    .catch((err) => {
      console.log(err)
    })
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  onCloseClick() {
    console.log('onCloseClick');
  }

  onClick(e) {
    console.log('onClick', e);
  }

  render() {
    return (
      <Header>
        <div className="charityProfilePage">
          <Grid>
            <Row>
              <h2 className="charityName">{this.state.charity.name}</h2>
              <div className="charityType">{this.state.charity.nteeType}</div>
              <div className="charityActivities">{this.state.charity.activity1} {this.state.charity.activity2} {this.state.charity.activity3}</div>
              <h3> Total AddUp+ Donations to Date: </h3>

              {this.state.selected ? <Button className="removeCharity" bsStyle="primary">Remove from My Charities</Button> : <Button className="addCharity" bsStyle="primary">Add to My Charities</Button>}
            </Row>

            <Row>
              <Col md={6} mdPush={6} className="charityClassification">
                <h4>Foundation Classification Info</h4>
                <div className="corpInfo">{this.state.charity.organization}, {this.state.charity.classification}</div>
                <div className="corpInfo">Section {this.state.charity.subsection} {this.state.charity.deductibility}</div>
                <div className="corpInfo">Reported Revenue: ${this.state.charity.totrevenue}</div>
                <div className="corpInfo">{this.state.charity.foundation}</div>
                <div className="corpInfo">{this.state.charity.affiliation}</div>
              </Col>

              <Col md={6} mdPull={6} className="charityLocation">
                <h4>Location and Contact</h4>
                <div className="addressHeader">Address:</div>
                <div className="address">{this.state.charity.name}</div>
                <div className="address">{this.state.charity.street}</div>
                <div className="address">{this.state.charity.city}, {this.state.charity.state} {this.state.charity.zipCode}</div>
                <div className="address">{this.state.charity.country}</div>
                <div className="map">
                  <Gmaps
                    width={'300px'}
                    height={'300px'}
                    lat={this.state.charity.latitude}
                    lng={this.state.charity.longitude}
                    zoom={12}
                    params={{v: '3.exp', key: apiKeys.gmaps}}
                    onMapCreated={this.onMapCreated}>
                    <Marker
                      lat={this.state.charity.latitude}
                      lng={this.state.charity.longitude}
                      draggable={true}
                      onDragEnd={this.onDragEnd} />
                  </Gmaps>
                </div>
              </Col>
            </Row>

          </Grid>
        </div>
      </Header>
    );
  }
}

export default CharityProfilePage;

