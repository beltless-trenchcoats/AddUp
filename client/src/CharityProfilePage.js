import React, { Component } from 'react';
import { Button, Grid, Col, Row } from 'react-bootstrap';
import { Gmaps, Marker } from 'react-gmaps';
import axios from 'axios';
import _ from 'lodash';
import { browserHistory } from 'react-router';

import server from '../../server/config/config';

import Header from './Header';
import CharityModal from './CharityModal';

//This line allows us to use underscore-style variable names
/* eslint-disable camelcase */

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
      selected: false, //TODO: Add flag to change button depending on if charity is already selected
      invalidCharity: false,
      gmapsKey: ''
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount () {
    axios.get(server + '/api/gmaps')
    .then((res) => {
      this.setState({
        gmapsKey: res.data
      });
    })
    .catch((err) => {
      console.log(err);
    });
    axios.post(server + '/api/charity', {
      charityId: this.state.charityId,
      type: this.props.params.type
    })
    .then((res) => {
      if (res.data === 'Not Found') {
        this.setState({invalidCharity: true});
      } else {
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
        });
      }
    })
    .then(() => {
      if (!this.state.invalidCharity && this.state.charity.id_owner) {
        axios.post(server + '/api/user/info', {
          idOrEmail: (this.state.charity.id_owner).toString()
        })
        .then((res) => {
          let first = res.data.first_name;
          let lastInitial = res.data.last_name[0];
          this.setState({
            charityAuthor: res.data,
            authorName: first + ' ' + lastInitial + '.'
          });
        })
        .catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.log(err);
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
    <div>
      {
        this.state.invalidCharity ? 
        <h1>404 Not Found</h1>
        :
      <Header>
        <div className="charityProfilePage">
          {
            history.state ? <button className='backButton' onClick={browserHistory.goBack}>&#x2190; Back To Search Results</button>
              : null
          }
          
          <Grid>
            <Row className='charityInfo lessPadding'>
              <Col md={3} mdPush={9}>
              {
                this.state.selected ?
                  <Button onClick={this.openModal} className="removeCharity" bsStyle="primary">Remove from My Charities</Button>
                : <Button onClick={this.openModal} className="addCharity" bsStyle="primary">Add to My Charities</Button>
              }
              </Col>
              <Col md={9} mdPull={3}>
              <div className='charityName'>{this.state.charity.name}</div>
              {
                this.state.charity.id_owner ? <div className="charityAuthor">Created by: {<a href={'/profile/' + this.state.charityAuthor.id}> {this.state.authorName}</a>}</div> 
                : null 
              }
              {
                this.state.charity.nteeType !== 'Not Provided' ? <div className='category'>{this.state.charity.nteeType}</div> : null
              }
              {
                this.state.charity.url ?
                  <div className="charityType">{this.state.charity.url}</div>
                : null
              }

              {
                this.state.charity.mission_statement ?
                  <div className="mission">{this.state.charity.mission_statement}</div>
                : <div className="mission"></div>
              }
              {
                this.props.params.type === 'custom' ?
                  <div className='percentFunded'> {
                    this.state.charity.total_donated * 100 / this.state.charity.dollar_goal ?
                      Math.floor(this.state.charity.total_donated * 100 / this.state.charity.dollar_goal)
                      : 0}% Funded!</div>
                : null
              }
              <div className='donationsToDate'>AddUp+ Donations to Date: ${this.state.charity.total_donated}</div>
              {
                this.props.params.type === 'custom' ?
                  <div className='goal'> Fundraising Goal: ${this.state.charity.dollar_goal}</div>
                : null
              } 
              </Col>
            </Row>

            <Row>
              <Col md={6} mdPush={6} className="charityClassification">
                {
                  this.props.params.type !== 'custom' ? 
                    <div className='charityClassification'>Foundation Classification Info</div> 
                  : null 
                }
                <div className="corpInfo">{this.state.charity.organization}, {this.state.charity.classification}</div>
                {
                  this.props.params.type !== 'custom' ?
                    <div className="corpInfo">Section {this.state.charity.subsection} {this.state.charity.deductibility}</div>
                    : null
                }
                {
                  this.props.params.type !== 'custom' ?
                    <div className="corpInfo">Reported Revenue: ${this.state.charity.totrevenue}</div> : null
                }
                <div className="corpInfo">{this.state.charity.foundation}</div>
                <div className="corpInfo">{this.state.charity.affiliation}</div>
              </Col>

              <Col md={6} mdPull={6} className="charityLocation">
                <div className="map">
                  {
                    this.props.params.type === 'custom' || !(this.state.gmapsKey) ? null : 
                    <Gmaps
                      width={'300px'}
                      height={'300px'}
                      lat={this.state.charity.latitude}
                      lng={this.state.charity.longitude}
                      zoom={12}
                      params={{v: '3.exp', key: this.state.gmapsKey}}
                      onMapCreated={this.onMapCreated}>
                      <Marker
                        lat={this.state.charity.latitude}
                        lng={this.state.charity.longitude}
                        draggable={true}
                        onDragEnd={this.onDragEnd} />
                    </Gmaps>
                  }
                </div>
                <div className="addressName">{this.state.charity.name}</div>
                <div className="address">{this.state.charity.street}</div>
                <div className="address">{this.state.charity.city}, {this.state.charity.state} {this.state.charity.zipCode}</div>
                <div className="address">{this.state.charity.country}</div>
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
      }
      </div>
    );
  }
}

export default CharityProfilePage;
