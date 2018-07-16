/* @flow */

import { put } from 'redux-saga/effects';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { showNotification } from 'makeandship-js-common/src/modules/notifications';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experimentProvider/',
  getState: state => state.experiments.experimentProvider,
  initialData: {},
  update: {
    operationId: 'experimentProviderUpload',
    onSuccess: function*() {
      yield put(showNotification('Sample received'));
    },
  },
});

const {
  reducer,
  actionType,
  actions: { updateEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  updateEntity as updateExperimentProvider,
  getEntity as getExperimentProvider,
  getError,
  getIsFetching,
  entitySaga as experimentProviderSaga,
  actionType as experimentProviderActionType,
};

export default reducer;
