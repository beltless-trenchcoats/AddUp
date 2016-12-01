import React, { Component } from 'react';
import { Button, Modal, Checkbox, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';

import server from '../../server/config/config';

import categoryHelper from '../../server/helpers';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
};

class AddCauseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCauseModal: false,
      addCustomCauseFields: {},
      causePrivacy: true,
    };

    this.openCause = this.openCause.bind(this);
    this.closeCause = this.closeCause.bind(this);
    this.toggleCausePrivacy = this.toggleCausePrivacy.bind(this);
    this.submitCause = this.submitCause.bind(this);
  }

  openCause () {
    this.setState({ showCauseModal: true});
  }

  closeCause () {
    this.setState({ showCauseModal: false});
  }

  onFieldChange(type, e) {
    var fields = this.state.addCustomCauseFields;
    if (typeof e.target.value === 'string') {
      fields[type] = e.target.value.replace("'", "");
    } else {
      fields[type] = e.target.value;
    }
    this.setState({addCustomCauseFields: fields});
  }

  toggleCausePrivacy() {
    this.setState({causePrivacy: !(this.state.causePrivacy)});
  }

  submitCause() {
    var fields = this.state.addCustomCauseFields;
    fields.private = '' + this.state.causePrivacy;
    fields.type = 'custom';
    if (this.props.purpose === 'add') {
      fields.id_owner = Number(this.props.session.id);
      fields.dollar_goal = Number(fields.dollar_goal);
      axios.post(server + '/api/customCause/add', fields)
        .then(res => {
          axios.post(server + '/api/charities/search', {
            'id_owner': fields.id_owner,
            'type': 'Custom Cause'
          })
          .then(response => {
            this.props.setCauses(response.data);
          });
        });
    } else {
      var charityID = this.props.charity.id;
      if (fields.dollar_goal) { fields.dollar_goal = Number(fields.dollar_goal); }
      axios.post(server + '/api/charity/update', {charityID: charityID, updateFields: fields})
        .then(res => {
          axios.post(server + '/api/customCause/search', {
            'id': charityID
          })
          .then(response => {
            this.props.getCharityInfo();
          });
        });
    }
    this.closeCause();
  }

  render() {
    return (
      <div>
        {
          this.props.purpose === 'add' ? 
          <Button className='startButton' onClick={this.openCause}>Get Started</Button>
          :
          <Button className='button' onClick={this.openCause}>Edit Cause</Button>
        }

        <Modal className="modal" show={this.state.showCauseModal} onHide={this.closeCause}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Cause</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please provide detailed information so users will want to donate to your cause!</p>

            <form onSubmit={this.submitCause}>
              <FieldGroup
                id="formControlsCausename"
                type="text"
                required={true}
                label="Cause Name*"
                placeholder="Cause Name"
                onChange={this.onFieldChange.bind(this, 'name')}
                defaultValue={this.props.charity ? this.props.charity.name : null}
              />
              <FieldGroup
                id="formControlsEmail"
                type="email"
                required={true}
                label="Email associated with your PayPal Account (to collect donations)*"
                placeholder="example@gmailcom"
                onChange={this.onFieldChange.bind(this, 'paypalemail')}
                defaultValue={this.props.charity ? this.props.charity.paypalemail : null}
              />
              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Category</ControlLabel>
                <FormControl componentClass="select" onChange={this.onFieldChange.bind(this, 'category')} placeholder="Category">
                  <option value={this.props.charity ? categoryHelper.convertStringToCategory(this.props.charity.category) : ''}>{this.props.charity ? this.props.charity.category : ''}</option>
                  <option value="A">Arts, Culture and Humanities</option>
                  <option value="B">Educational Institutions and Related Activities</option>
                  <option value="C">Environmental Quality, Protection and Beautification</option>
                  <option value="D">Animal-Related</option>
                  <option value="E">Health - General and Rehabilitative</option>
                  <option value="F">Mental Health, Crisis Intervention</option>
                  <option value="G">Diseases, Disorders, Medical Disciplines</option>
                  <option value="H">Medical Research</option>
                  <option value="I">Crime, Legal-Related</option>
                  <option value="J">Employment, Job-Related</option>
                  <option value="K">Food, Agriculture and Nutrition</option>
                  <option value="L">Housing, Shelter</option>
                  <option value="M">Public Safety, Disaster Preparedness and Relief</option>
                  <option value="N">Recreation, Sports, Leisure, Athletics</option>
                  <option value="O">Youth Development</option>
                  <option value="P">Human Services - Multipurpose and Other</option>
                  <option value="Q">International, Foreign Affairs and National Security</option>
                  <option value="R">Civil Rights, Social Action, Advocacy</option>
                  <option value="S">Community Improvement, Capacity Building</option>
                  <option value="T">Philanthropy, Voluntarism and Grantmaking Foundations</option>
                  <option value="U">Science and Technology Research Institutes, Services</option>
                  <option value="V">Social Science Research Institutes, Services</option>
                  <option value="W">Public, Society Benefit - Multipurpose and Other</option>
                  <option value="X">Religion-Related, Spiritual Development</option>
                  <option value="Y">Mutual/Membership Benefit Organizations, Other</option>
                </FormControl>
              </FormGroup>
              <FieldGroup
                id="formControlsDescription"
                type="text"
                required={true}
                label="Description*"
                placeholder="Description"
                onChange={this.onFieldChange.bind(this, 'mission_statement')}
                defaultValue={this.props.charity ? this.props.charity.mission_statement : null}
              />
              <FieldGroup
                id="formControlsGoal"
                type="text"
                required={true}
                label="Fundraising Goal*"
                placeholder="100000000"
                onChange={this.onFieldChange.bind(this, 'dollar_goal')}
                defaultValue={this.props.charity ? this.props.charity.dollar_goal : null}
              />
              <FieldGroup
                id="formControlsCity"
                type="text"
                required={true}
                label="City*"
                placeholder="City"
                onChange={this.onFieldChange.bind(this, 'city')}
                defaultValue={this.props.charity ? this.props.charity.city : null}
              />
              <FieldGroup
                id="formControlsState"
                type="text"
                required={true}
                label="State*"
                placeholder="State"
                onChange={this.onFieldChange.bind(this, 'state')}
                defaultValue={this.props.charity ? this.props.charity.state : null}
              />
              <FieldGroup
                id="formControlsZip"
                type="text"
                required={true}
                label="Zip Code*"
                placeholder="Zip"
                onChange={this.onFieldChange.bind(this, 'zip')}
                defaultValue={this.props.charity ? this.props.charity.zip : null}
              />
              <FormGroup>
                <Checkbox onChange={this.toggleCausePrivacy}>
                  Appear in public search results?
                </Checkbox>
              </FormGroup>
              <Button
                className="modalButton"
                bsStyle="primary"
                type="submit"
                >Save
              </Button>
              <Button className="modalButton" onClick={this.closeCause}>Cancel</Button>
            </form>

          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default AddCauseModal;