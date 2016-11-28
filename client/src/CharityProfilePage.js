import React, { Component } from 'react';
import { Button, Grid, Col, Row } from 'react-bootstrap';
import { Gmaps, Marker } from 'react-gmaps';
import axios from 'axios';
import _ from 'lodash';
import apiKeys from '../../server/config/API_Keys';
import { browserHistory } from 'react-router';

import Header from './Header';
import CharityModal from './CharityModal';
import apiKeys from '../../server/config/API_Keys';

class CharityProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charityId: this.props.params.id,
      charity: {},
      charityAuthor: {},
      authorName: '',
      basicCharityInfo: {},
      showModal: false,
      selected: false //TODO: Add flag to change button depending on if charity is already selected
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount () {
    axios.post('http://localhost:8080/api/charity', {
      charityId: this.state.charityId,
      type: this.props.params.type
    })
    .then((res) => {
      res.data.name = res.data.name.split(' ').map(word => _.capitalize(word)).join(' ');
      this.setState({
        charity: res.data,
        basicCharityInfo: {
          name: res.data.name,
          ein: res.data.ein,
          city: res.data.city,
          state: res.data.state,
          zip: res.data.zipCode || res.data.zip,
          donation_url: res.data.donationUrl || res.data.donation_url,
          mission_statement: res.data.missionStatement || res.data.mission_statement,
          id: res.data.id,
          type: res.data.type || 'charity'
        }
      })
    })
    .then(() => {
      if (this.state.charity.id_owner) {
        axios.post('http://localhost:8080/api/user/info', {
          idOrEmail: (this.state.charity.id_owner).toString()
        })
        .then((res) => {
          let first = res.data.first_name;
          let lastInitial = res.data.last_name[0]
          this.setState({
            charityAuthor: res.data,
            authorName: first + ' ' + lastInitial + '.'
          })
        })
        .catch((err) => {
          console.log(err)
        })
      }
    })
    .catch((err) => {
      console.log(err)
    });
  }

  openModal() {
    this.setState({ showModal: true });
  }
  closeModal() {
    this.setState({ showModal: false });
  }

  /*
  * Google Maps functions
  */
  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }
  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  render() {
    return (
      <Header>
        <div className="charityProfilePage">
          <button onClick={browserHistory.goBack}>Back To Search Results</button>
          <Grid>
            <Row>
              <h2 className="charityName">{this.state.charity.name}</h2>
              {this.state.charity.id_owner ? <h5 className="charityAuthor">Created by: {<a href={"/profile/" + this.state.charityAuthor.id}> {this.state.authorName}</a>}</h5> : null }
              <div className="charityType">{this.state.charity.nteeType}</div>
              <div className="charityType">{this.state.charity.category}</div>
              {
                this.state.charity.mission_statement ?
                  <div className="charityType">{this.state.charity.mission_statement}</div>
                : null
              }
              <div className="charityActivities">
                {
                  this.state.charity.activity1 ? this.state.charity.activity1 + ',' : null
                }
                {
                  this.state.charity.activity2 ? this.state.charity.activity2 + ',' : null
                }
                {this.state.charity.activity3}
              </div>
              {
                this.props.params.type==='custom' ?
                  <h3> ${
                    this.state.charity.total_donated * 100 / this.state.charity.dollar_goal ?
                      Math.floor(this.state.charity.total_donated * 100 / this.state.charity.dollar_goal)
                      : 0}% Funded!</h3>
                : null
              }
              <h3> Total AddUp+ Donations to Date: ${this.state.charity.total_donated}</h3>
              {
                this.props.params.type==='custom' ?
                  <h3> Fundraising Goal: ${this.state.charity.dollar_goal}</h3>
                : null
              }
              {
                this.state.selected ?
                  <Button onClick={this.openModal} className="removeCharity" bsStyle="primary">Remove from My Charities</Button>
                : <Button onClick={this.openModal} className="addCharity" bsStyle="primary">Add to My Charities</Button>}
            </Row>

            <Row>
                {<Col md={6} mdPush={6} className="charityClassification">
                  {this.props.params.type!=='custom' ? <h4>Foundation Classification Info</h4> : null }
                  <div className="corpInfo">{this.state.charity.organization}, {this.state.charity.classification}</div>
                  {
                    this.props.params.type!=='custom' ?
                      <div className="corpInfo">Section {this.state.charity.subsection} {this.state.charity.deductibility}</div>
                      : null
                  }
                  {
                    this.props.params.type!=='custom' ?
                      <div className="corpInfo">Reported Revenue: ${this.state.charity.totrevenue}</div> : null
                  }
                  <div className="corpInfo">{this.state.charity.foundation}</div>
                  <div className="corpInfo">{this.state.charity.affiliation}</div>
                </Col>}

              <Col md={6} mdPull={6} className="charityLocation">
                <h4>Location and Contact</h4>
                <div className="addressHeader">Address:</div>
                <div className="address">{this.state.charity.name}</div>
                <div className="address">{this.state.charity.street}</div>
                <div className="address">{this.state.charity.city}, {this.state.charity.state} {this.state.charity.zipCode}</div>
                <div className="address">{this.state.charity.country}</div>
                <div className="map">
                  {this.props.params.type==='custom' ? null : <Gmaps
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
                  </Gmaps>}
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        {
          this.state.showModal ?
          <CharityModal
            show={this.state.showModal}
            onHide={this.closeModal}
            currentCharity={this.state.basicCharityInfo}
          />
          : null
        }

      </Header>
    );
  }
}

export default CharityProfilePage;
