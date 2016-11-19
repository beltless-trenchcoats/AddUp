import React, { Component } from 'react';
import { Col, Row, Grid, Table, Button, Modal, Checkbox, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { Gmaps, Marker } from 'react-gmaps';
import axios from 'axios';

import apiKeys from '../../server/config/API_Keys';
import categoryHelper from '../../server/helpers';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

class EditCauseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charity: this.props.charity,
      editCustomCauseFields: {},
      causePrivacy: true
    }
  }

  onFieldChange(type, e) {
    var fields = this.state.editCustomCauseFields;
    fields[type] = e.target.value;
    console.log('fields is now ', fields);
    this.setState({editCustomCauseFields: fields});
  }

  toggleCausePrivacy() {
    console.log('this is getting called privacy');
    this.setState({causePrivacy: !(this.state.causePrivacy)});
  }

  submitCause() {
    var fields = this.state.editCustomCauseFields;
    var charityID = this.props.charity.id;
    fields.private = '' + this.state.causePrivacy;
    fields.type = 'custom';
    if (fields.dollar_goal) { fields.dollar_goal = Number(fields.dollar_goal); }
    console.log('submitting', JSON.stringify({charityID: charityID, updateFields: fields}));
    axios.post('http://localhost:8080/api/charity/update', {charityID: charityID, updateFields: fields})
      .then(res => {
        console.log('response', res);
        axios.post('http://localhost:8080/api/customCause/search', {
          'id': charityID
          })
          .then(response => {
            console.log(response);
            this.props.getCharityInfo();
          });
      });
    this.props.closeCause();
  }

  render() {
    return (
      <Modal className="modal" show={this.props.showCauseModal} onHide={this.props.closeCause}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Cause</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please provide detailed information so users will want to donate to your cause!</p>

          <form>
            <FieldGroup
              id="formControlsCausename"
              type="text"
              required={true}
              label="Cause Name*"
              placeholder="Cause Name"
              onChange={this.onFieldChange.bind(this, 'name')}
              defaultValue={this.props.charity.name}
            />
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Category</ControlLabel>
              <FormControl componentClass="select" onChange={this.onFieldChange.bind(this, 'category')} placeholder="Category">
                <option value={categoryHelper.convertStringToCategory(this.props.charity.category)}>{this.props.charity.category}</option>
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
              defaultValue={this.props.charity.mission_statement}
            />
            <FieldGroup
              id="formControlsGoal"
              type="text"
              required={true}
              label="Fundraising Goal*"
              placeholder="100000000"
              onChange={this.onFieldChange.bind(this, 'dollar_goal')}
              defaultValue={this.props.charity.dollar_goal}
            />
            <FieldGroup
              id="formControlsCity"
              type="text"
              required={true}
              label="City*"
              placeholder="City"
              onChange={this.onFieldChange.bind(this, 'city')}
              defaultValue={this.props.charity.city}
            />
            <FieldGroup
              id="formControlsState"
              type="text"
              required={true}
              label="State*"
              placeholder="State"
              onChange={this.onFieldChange.bind(this, 'state')}
              defaultValue={this.props.charity.state}
            />
            <FieldGroup
              id="formControlsZip"
              type="text"
              required={true}
              label="Zip Code*"
              placeholder="Zip"
              onChange={this.onFieldChange.bind(this, 'zip')}
              defaultValue={this.props.charity.zip}
            />
            <FormGroup>
              <Checkbox onChange={this.toggleCausePrivacy.bind(this)}>
                Appear in public search results?
              </Checkbox>
            </FormGroup>
            <Button
              className="modalButton"
              bsStyle="primary"
              onClick={this.submitCause.bind(this)}
              >Save
            </Button>
            <Button className="modalButton" onClick={this.props.closeCause}>Cancel</Button>
          </form>

        </Modal.Body>
      </Modal>
    );
  }
}

export default EditCauseModal;