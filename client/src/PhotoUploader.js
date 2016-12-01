import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import FaUser from 'react-icons/lib/fa/user';

import server from '../../server/config/config';

import axios from 'axios';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
};

class PhotoUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      userPhoto: this.props.user.photo_url,
      loading: false
    };
    this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
    this.getSignedRequest = this.getSignedRequest.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadProfilePhoto() {
    const file = document.getElementById('formControlsFile').files[0];
    file == null ? alert('No file selected.') : this.getSignedRequest(file);
  }
  getSignedRequest(file) {
    axios.get(server + `/sign-s3?file-name=${file.name}&file-type=${file.type}`) //&userId=${this.props.user.id}`)
    .then((res) => {
      this.uploadFile(file, res.data.signedRequest, res.data.url);
    })
    .catch ((err)=> {
      alert('Could not get signed URL.');
      console.log(err);
    });
  }
  uploadFile(file, signedRequest, url) {
    var options = {
      headers: {
        'Content-Type': file.type
      }
    };
    axios.put(signedRequest, file, options)
    .then((res) => {
      this.setState({ userPhoto: url});
      axios.post(server + '/api/user/update', {
        email: this.props.user.email,
        photoUrl: url
      })
      .then((res) => console.log('New image uploaded'))
      .catch((err) => console.log(err));
    })
    .catch((err) => {
      alert('Could not upload file.');
      console.log(err);
    });
  }

  render() {
    return (
     <div className="profilePhoto">
        <div className="profilePhotoImage">
          {this.props.user.photo_url ? <img src={this.props.user.photo_url} alt="Profile" className="image"/> : <FaUser className="image"/>}
        </div>

        <FieldGroup
          className="profilePhotoUpload"
          id="formControlsFile"
          type="file"
          label="Upload a Profile Photo"
          ref="fileUpload"
          onChange={this.uploadProfilePhoto}
        />
      </div>
    );
  }
}

export default PhotoUploader;
