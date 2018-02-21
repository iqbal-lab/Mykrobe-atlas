/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { FETCH_JSON, fetchJsonMiddleware } from './fetchJsonMiddleware';
import { BASE_URL } from '../../constants/APIConstants.js';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const createMockStore = configureMockStore([thunk, fetchJsonMiddleware]);

const initialState = {
  auth: {
    auth: {
      user: {
        token: 'MOCK_AUTH_TOKEN_FOR_TESTING',
      },
    },
  },
};

const debug = true;

describe('fetchJsonMiddleware', () => {
  const store = createMockStore(initialState);

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
  });

  it('should handle basic GET request and resolve as promise', async () => {
    const meta = { test: true };
    const payload = { test: true };
    nock(BASE_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(200, { status: 'success', data: payload });
    const result = await store.dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/test/fetchJsonMiddleware`,
        types: [{ type: REQUEST, meta }, SUCCESS, FAILURE],
        debug,
      },
    });
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(REQUEST);
    expect(dispatchedActions[0].meta).toEqual(meta);
    expect(dispatchedActions[1].type).toEqual(SUCCESS);
    expect(dispatchedActions[1].payload).toEqual(payload);
    expect(result).toEqual(payload);
    console.log(
      'dispatchedActions',
      JSON.stringify(dispatchedActions, null, 2)
    );
  });

  it('should reject empty response', async () => {
    nock(BASE_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(200);
    try {
      await store.dispatch({
        [FETCH_JSON]: {
          url: `${BASE_URL}/test/fetchJsonMiddleware`,
          types: [REQUEST, SUCCESS, FAILURE],
          debug,
        },
      });
    } catch (error) {
      expect(error.name).toEqual('FetchJsonError');
      const dispatchedActions = store.getActions();
      expect(dispatchedActions[0].type).toEqual(REQUEST);
      expect(dispatchedActions[1].type).toEqual(FAILURE);
      console.log(
        'dispatchedActions',
        JSON.stringify(dispatchedActions, null, 2)
      );
    }
  });

  it('should reject non-jsend response', async () => {
    nock(BASE_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(200, { data: { test: true } });
    try {
      await store.dispatch({
        [FETCH_JSON]: {
          url: `${BASE_URL}/test/fetchJsonMiddleware`,
          types: [REQUEST, SUCCESS, FAILURE],
          debug,
        },
      });
    } catch (error) {
      expect(error.name).toEqual('FetchJsonError');
      const dispatchedActions = store.getActions();
      expect(dispatchedActions[0].type).toEqual(REQUEST);
      expect(dispatchedActions[1].type).toEqual(FAILURE);
      console.log(
        'dispatchedActions',
        JSON.stringify(dispatchedActions, null, 2)
      );
    }
  });
});
