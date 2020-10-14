/* @flow */

import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { combineReducers } from 'redux';

import uploadFileReducer, { uploadFileSaga } from './uploadFile';
import { uploadNotificationSaga } from './uploadNotification';
import { uploadDropboxSaga } from './uploadDropbox';
import { uploadGoogleDriveSaga } from './uploadGoogleDrive';
import { uploadBoxSaga } from './uploadBox';
import { uploadOneDriveSaga } from './uploadOneDrive';
import { uploadFileCancelWarningSaga } from './uploadFileCancelWarning';

export {
  uploadFile,
  uploadFileCancel,
  uploadFileDrop,
  uploadFileAssignBrowse,
  uploadFileSaga,
  getIsBusy,
  getProgress,
  getIsUploading,
  getIsComputingChecksums,
  getUploadProgress,
  getChecksumProgress,
  getExperimentId,
  getFileName,
} from './uploadFile';

export {
  RESUMABLE_UPLOAD_FILES_ADDED,
  RESUMABLE_UPLOAD_PROGRESS,
  RESUMABLE_UPLOAD_ERROR,
  RESUMABLE_UPLOAD_DONE,
} from './util/ResumableUpload';

export {
  COMPUTE_CHECKSUMS_PROGRESS,
  COMPUTE_CHECKSUMS_COMPLETE,
} from './util/ComputeChecksums';

export { uploadDropbox, uploadDropboxSaga } from './uploadDropbox';
export { uploadGoogleDrive, uploadGoogleDriveSaga } from './uploadGoogleDrive';
export { uploadBox, uploadBoxSaga } from './uploadBox';
export { uploadOneDrive, uploadOneDriveSaga } from './uploadOneDrive';

const uploadReducer = combineReducers({
  uploadFile: uploadFileReducer,
});

export default uploadReducer;

export function* rootUploadSaga(): Saga {
  yield all([
    fork(uploadFileSaga),
    fork(uploadNotificationSaga),
    fork(uploadDropboxSaga),
    fork(uploadGoogleDriveSaga),
    fork(uploadBoxSaga),
    fork(uploadOneDriveSaga),
    fork(uploadFileCancelWarningSaga),
  ]);
}
