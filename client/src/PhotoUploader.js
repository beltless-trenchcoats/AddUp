import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import FaUser from 'react-icons/lib/fa/user';

import axios from 'axios';

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

class PhotoUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: this.props.user,
      loading: false
    }
    this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
    this.getSignedRequest = this.getSignedRequest.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadProfilePhoto() {
    const file = document.getElementById('formControlsFile').files[0];
    console.log(file)
    file == null ? alert('No file selected.') : this.getSignedRequest(file);
  }

  getSignedRequest(file){
    axios.get(`http://localhost:8080/sign-s3?file-name=${file.name}&file-type=${file.type}&userId=${this.props.user.id}`)
    .then((res) => {
      console.log('GETSIGNED REQUEST!', res)
      this.uploadFile(file, res.data.signedRequest, res.data.url);
    })
    .catch ((err)=> {
      alert('Could not get signed URL.')
      console.log(err);
    })
  }

  uploadFile(file, signedRequest, url) {
    console.log('UPLOADFILE', file, signedRequest, url)
    axios.put(signedRequest)
    .then((res) => {
      console.log('UPLOADFILE RESPONSE', res)
      this.setState({ profilePhotoUrl: url})
      res.send(file)
    })
    .catch((err) => {
      alert('Could not upload file.');
      console.log(err);
    })
  }

  render() {
    return (
     <div className="profilePhoto">
        <FieldGroup
          className="profilePhotoUpload"
          id="formControlsFile"
          type="file"
          label="Upload a Profile Photo"
          ref="fileUpload"
          onChange={this.uploadProfilePhoto}
        />

        <div className="profilePhotoImage">
        {this.state.profilePhotoUrl ? <div className="image"><img src={this.state.profilePhotoUrl}/></div> : <FaUser className="image"/>}
        </div>
      </div>
    );
  }
}

export default PhotoUploader;