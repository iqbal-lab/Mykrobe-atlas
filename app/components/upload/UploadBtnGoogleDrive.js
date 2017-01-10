/* @flow */

import React, { Component, PropTypes } from 'react';
import loadScript from 'load-script';
import styles from './Upload.css';

const CLIENT_ID = '971300101515-nf9vb3c52smc7nudb2cjie7fd21keqj7.apps.googleusercontent.com';
const DEVELOPER_KEY = 'AIzaSyBNgTFyDmqIn9P-ivtXlTD8nfk6Qgn1TBI';
const SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

let isLoading = false;

export default class UploadBtnGoogleDrive extends Component {
  render() {
    return (
      <button
        className={styles.button}
        onClick={(event) => this.onClick(event)}>
        Google Drive
      </button>
    );
  }

  componentDidMount() {
    if (this.isGoogleReady()) {
      this.onApiLoad();
    }
    else if (!isLoading) {
      isLoading = true;
      loadScript(GOOGLE_SDK_URL, this.onApiLoad);
    }
  }

  isGoogleReady() {
    return !!window.gapi;
  }

  isGoogleAuthReady() {
    return !!window.gapi.auth;
  }

  isGooglePickerReady() {
    return !!window.google.picker;
  }

  onApiLoad() {
    window.gapi.load('auth');
    window.gapi.load('picker');
  }

  authoriseApp(callback: Function) {
    window.gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPE,
      immediate: false
    },
    callback);
  }

  createPicker(oauthToken: string) {
    const picker = new window.google.picker.PickerBuilder();
    picker.addView(window.google.picker.ViewId.DOCS);
    picker.setOAuthToken(oauthToken);
    picker.setDeveloperKey(DEVELOPER_KEY);
    picker.setCallback((data) => {
      this.onFileSelect(data);
    });
    picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
    picker.build().setVisible(true);
  }

  onClick() {
    if (!this.isGoogleReady() || !this.isGoogleAuthReady() || !this.isGooglePickerReady()) {
      return null;
    }

    const token = window.gapi.auth.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      this.createPicker(oauthToken);
    }
    else {
      this.authoriseApp(({access_token}) => this.createPicker(access_token));
    }
  }

  onFileSelect(data: Object) {
    const {onFileSelect} = this.props;
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const file = data[window.google.picker.Response.DOCUMENTS][0];
      const id = file[window.google.picker.Document.ID];

      const request = new Request(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
        headers: new Headers({
          'Authorization': 'Bearer ' + window.gapi.auth.getToken().access_token
        })
      });

      fetch(request)
        .then((response) => {
          if (response.ok) {
            onFileSelect(response);
          }
        });
    }
  }
}

UploadBtnGoogleDrive.propTypes = {
  onFileSelect: PropTypes.func.isRequired
};
