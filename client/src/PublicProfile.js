import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import FaUser from 'react-icons/lib/fa/user';

import Header from './Header';

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileInfo: {},
      charities: {},
      lastInitial: '',
      customCauses: []
    }
  }

  componentWillMount () {
    axios.post('https://beltless-trenchcoats.herokuapp.com/api/user/info', {
      idOrEmail: this.props.params.id
    })
    .then((res) => {
      this.setState ({
        profileInfo: res.data,
        lastInitial: res.data.last_name.charAt(0)
      }, () => {
        // console.log('profileinfo', this.state.profileInfo)
        axios.post('https://beltless-trenchcoats.herokuapp.com/api/user/charities/info', {
          email: this.state.profileInfo.email
        })
        .then((res) => {
          this.setState({
            charities: res.data
          })
          // console.log('CHAIRITIES INFO', res.data)
          axios.post('https://beltless-trenchcoats.herokuapp.com/api/charities/search', {
            'id_owner': this.props.params.id,
            'type': 'Custom Cause'
            })
            .then(response => {
              if (response.data) {
                this.setState({customCauses: response.data}, ()=> console.log('CUSTOM CAUSES', this.state.customCauses));
              }
            });
        })  
        .catch((err) => {
          console.log(err)
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render () {
    return (
      <Header>
        <div className="publicProfile">
        <Row className='lessPadding'>
          <div className="userProfile">
            <Col xs={7} md={7}>
              {<div className='welcome'>{this.state.profileInfo.first_name} {this.state.lastInitial}.</div>}
            </Col>
            <Col xs={3} md={3}>
              <div className="profilePhotoImage">
                {this.state.profileInfo.photo_url ? <img src={this.state.profileInfo.photo_url} alt="Profile" className="image"/> : <FaUser className="image"/>}
              </div>
            </Col>
          </div>
        </Row>
        <Row id='charities'>
          {
            this.state.charities.length ?
          <div className="userCharitiesContainer">
            <div className='userCharities'>
            <h1>User's Current Charities and Causes</h1>
            {
              this.state.charities.sort((a, b) => b.percentage - a.percentage).map(charity =>
                <a href={'/' + charity.type + '/' + (charity.ein || charity.id)}>
                  <div className='userCharity'>
                    <div className='charityInfo'>
                      <div className='title'>{charity.name}</div>
                      {
                        (charity.goal_reached === '1') ?
                        <div className='goalReached'>&#10004; Goal Reached</div>
                        : null
                      }
                    </div>
                  </div>
                </a>
              )
            }
            </div>
          </div>
          : null
          }
        </Row>

        <Row>
          {
            this.state.customCauses.length ?
            <div className="userCharitiesContainer">
              <h1>This user's Personal Causes</h1>
              <div className='customCauses'>
              {
                this.state.customCauses.map(cause =>
                  <div className='customCause'>
                    <div className='title'>
                      <a href={'/myCause/edit/' + cause.id} className='title'>{cause.charityName}</a>
                    </div>
                    <div className='contributors'>Number of Contributors:</div>
                    <div className='percentage'>{Math.floor((cause.total_donated/cause.dollar_goal)*100)}%</div>
                    <div className='amount'>$ {cause.total_donated} / {cause.dollar_goal}</div>
                  </div>
                )
              }
              </div>
            </div>
            : null
          }
        </Row>
        </div>
      </Header>
    )
  }
}

export default PublicProfile;
