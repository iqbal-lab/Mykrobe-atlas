/* @flow */

import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { showNotification } from 'makeandship-js-common/src/modules/notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('user', {
  typePrefix: 'users/user/',
  getState: state => state.users.user,
  create: {
    operationId: 'usersCreate',
    onSuccess: function*() {
      yield put(showNotification('User created'));
      yield put(push('/users'));
    },
  },
  request: {
    operationId: 'usersGetById',
  },
  update: {
    operationId: 'usersUpdateById',
    onSuccess: function*() {
      yield put(showNotification('User updated'));
      yield put(push('/users'));
    },
  },
  delete: {
    operationId: 'usersDeleteById',
    onSuccess: function*() {
      yield put(showNotification('User deleted'));
      yield put(push('/users'));
    },
  },
});

const {
  reducer,
  actionType,
  actions: {
    newEntity,
    createEntity,
    requestEntity,
    updateEntity,
    deleteEntity,
  },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  newEntity as newUser,
  createEntity as createUser,
  requestEntity as requestUser,
  updateEntity as updateUser,
  deleteEntity as deleteUser,
  getEntity as getUser,
  getError,
  getIsFetching,
  entitySaga as userSaga,
  actionType as userActionType,
};

export default reducer;
