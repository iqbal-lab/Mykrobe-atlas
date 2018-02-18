/* @flow */

import { combineReducers } from 'redux';
import analyser from './analyser';

export {
  getAnalyser,
  getIsAnalysing,
  getTransformed,
  getProgress,
  monitorUpload,
  analyseFile,
  analyseFileCancel,
  analyseRemoteFile,
  fetchExperiment,
  analyseFileNew,
  analyseFileSave,
} from './analyser';

console.log('in modules/analyser/index.js -> analyser', analyser);

const reducer = combineReducers({
  analyser,
});

export default reducer;
