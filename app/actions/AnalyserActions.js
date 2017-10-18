/* @flow */

import { push } from 'react-router-redux';

import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import { showNotification } from './NotificationActions';
import UploadService from '../services/upload/UploadService';
import AnalyserService from '../services/analyser/AnalyserService';
import * as UIHelpers from '../helpers/UIHelpers'; // eslint-disable-line import/namespace

// $FlowFixMe: Ignore missing require().default
const analyserService = new AnalyserService();
const uploadService = new UploadService();

export function monitorUpload() {
  return (dispatch: Function) => {
    uploadService.uploadFile
      .on('prepare', filename => {
        dispatch(analyseFilePrepare(filename));
      })
      .on('upload', () => {
        dispatch(analyseFileUpload());
      })
      .on('progress', progress => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (file: File) => {
        dispatch(analyseFile(file, uploadService.getId()));
      })
      .on('error', error => {
        dispatch(analyseFileError(error));
      });
  };
}

function analyseFilePrepare(filename: string) {
  return (dispatch: Function) => {
    return uploadService
      .prepare()
      .then(experiment => {
        dispatch({
          type: ActionTypes.ANALYSE_FILE_PREPARE,
          filename,
          id: experiment.id,
        });
        dispatch(push(`/sample/${experiment.id}`));
      })
      .catch(error => {
        dispatch(analyseFileError(error));
      });
  };
}

function analyseFileUpload() {
  return {
    type: ActionTypes.ANALYSE_FILE_UPLOAD,
  };
}

export function analyseFile(file: File, id?: string) {
  return (dispatch: Function) => {
    if (IS_ELECTRON) {
      // $FlowFixMe: Ignore Electron require
      const { app } = require('electron').remote;
      if (file.path) {
        app.addRecentDocument(file.path);
      }
    }

    dispatch({
      type: ActionTypes.ANALYSE_FILE_ANALYSE,
    });

    IS_ELECTRON && dispatch(push('/'));

    analyserService
      .analyseFile(file, id)
      .on('progress', progress => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', result => {
        const { json, transformed } = result;
        dispatch(analyseFileSuccess(file.name, json, transformed));
        IS_ELECTRON && dispatch(push('/results'));
      })
      .on('error', error => {
        dispatch(analyseFileError(error.description));
      });
  };
}

// TODO rename methods

export function analyseFileCancel() {
  if (IS_ELECTRON) {
    return dispatch => {
      if (this.analyser) {
        this.analyser.cancel();
        this.analyser = null;
      }
      dispatch(push('/'));
      dispatch({
        type: ActionTypes.ANALYSE_FILE_CANCEL,
      });
    };
  }
  uploadService.uploadFile.cancel();
  return {
    type: ActionTypes.ANALYSE_FILE_CANCEL,
  };
}

function analyseFileSuccess(
  filename: string,
  json: Object,
  transformed: Object
) {
  return (dispatch: Function) => {
    dispatch(
      showNotification({
        category: NotificationCategories.SUCCESS,
        content: `Sample ${filename} analysis complete`,
      })
    );
    dispatch({
      type: ActionTypes.ANALYSE_FILE_SUCCESS,
      json,
      transformed,
    });
  };
}

function analyseFileProgress(progress: number) {
  return {
    type: ActionTypes.ANALYSE_FILE_PROGRESS,
    progress,
  };
}

function analyseFileError(error: string) {
  return (dispatch: Function) => {
    dispatch(
      showNotification({
        category: NotificationCategories.ERROR,
        content: error,
        autoHide: false,
      })
    );
    dispatch({
      type: ActionTypes.ANALYSE_FILE_ERROR,
      error,
    });
  };
}

export function analyseRemoteFile(file: Object) {
  return (dispatch: Function) => {
    return uploadService
      .prepare()
      .then(experiment => {
        dispatch({
          type: ActionTypes.ANALYSE_FILE_PREPARE,
          filename: file.name,
          id: experiment.id,
        });

        dispatch(push(`/sample/${experiment.id}`));

        uploadService.uploadRemoteFile(file).then(() => {
          dispatch({
            type: ActionTypes.ANALYSE_FILE_ANALYSE,
            filename: file.name,
            id: experiment.id,
          });

          analyserService
            .analyseRemoteFile(file)
            .on('progress', progress => {
              dispatch(analyseFileProgress(progress));
            })
            .on('done', result => {
              const { json, transformed } = result;
              dispatch(analyseFileSuccess(file.name, json, transformed));
            })
            .on('error', error => {
              dispatch(analyseFileError(error.description));
            });
        });
      })
      .catch(error => {
        dispatch(analyseFileError(error));
      });
  };
}

export function fetchExperiment(id: string) {
  return (dispatch: Function) => {
    analyserService
      .fetchExperiment(id)
      .then(result => {
        const { json, transformed } = result;
        dispatch({
          type: ActionTypes.ANALYSE_FILE_SUCCESS,
          json,
          transformed,
        });
      })
      .catch(error => {
        dispatch(analyseFileError(error));
      });
  };
}

export function analyseFileNew() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.analyser) {
      state.analyser.cancel && state.analyser.cancel();
    }
    dispatch(push('/'));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_NEW,
    });
  };
}

export function analyseFileSave() {
  return (dispatch, getState) => {
    if (IS_ELECTRON) {
      const state = getState();
      const fs = require('fs');
      const filePath = UIHelpers.saveFileDialog('mykrobe.json'); // eslint-disable-line import/namespace
      if (filePath) {
        const { analyser } = state;
        const json = JSON.stringify(analyser.json, null, 2);
        fs.writeFile(filePath, json, err => {
          if (err) {
            console.error(err);
          } else {
            console.log('JSON saved to ', filePath);
          }
        });
      }
    }
  };
}
