/* @flow */

import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { combineReducers } from 'redux';

import organisations, { organisationsSaga } from './organisations';
import organisation, { organisationSaga } from './organisation';
import organisationsFilters, {
  syncOrganisationsFiltersSaga,
} from './organisationsFilters';

export {
  getIsFetching as getOrganisationsIsFetching,
  getError as getOrganisationsError,
  getOrganisations,
  requestOrganisations,
  organisationsSaga,
} from './organisations';

export {
  getIsFetching as getOrganisationIsFetching,
  getError as getOrganisationError,
  getOrganisation,
  newOrganisation,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
  organisationSaga,
} from './organisation';

export {
  setOrganisationsFilters,
  resetOrganisationsFilters,
  getOrganisationsFilters,
  getOrganisationsHasDataFilters,
  getOrganisationsFiltersSaga,
  organisationsFiltersActionType,
} from './organisationsFilters';

const reducer = combineReducers({
  organisations,
  organisationsFilters,
  organisation,
});

export default reducer;

export function* rootOrganisationsSaga(): Saga {
  yield all([
    fork(organisationsSaga),
    fork(organisationSaga),
    fork(syncOrganisationsFiltersSaga),
  ]);
}
