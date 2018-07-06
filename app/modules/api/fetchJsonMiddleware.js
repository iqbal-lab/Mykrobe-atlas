/* @flow */

import type { JSendType } from '../../types/JSendType';

// TODO: make token access more generic
import {
  getAccessToken,
  signOut,
} from 'makeandship-js-common/src/modules/auth';
import {
  showNotification,
  NotificationCategories,
} from 'makeandship-js-common/src/modules/notifications';

import { fetchToCurl } from './fetchToCurl';

export const FETCH_JSON = '@@fetch-json-middleware/FETCH_JSON';

export class FetchJsonError extends Error {
  constructor(status, statusText, response) {
    super();
    this.name = 'FetchJsonError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.message = `${status} - ${statusText}`;
  }
}

const isFetchJson = action => {
  return action.hasOwnProperty && action.hasOwnProperty(FETCH_JSON);
};

const normalizeTypes = types =>
  types.map(type => {
    if (typeof type === 'string') {
      return {
        type,
      };
    }
    return type;
  });

export const fetchJsonMiddleware = store => next => action => {
  // Do not process actions without [FETCH_JSON] property
  if (!isFetchJson(action)) {
    return next(action);
  }

  const fetchJsonParameters = action[FETCH_JSON];

  const { url, options = {}, types, debug = false } = fetchJsonParameters;

  const [REQUEST, SUCCESS, FAILURE] = normalizeTypes(types);

  next(REQUEST);

  const state = store.getState();
  const token = getAccessToken(state);

  if (!options.headers) {
    options.headers = {};
  }
  options.headers = {
    ...options.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (debug) {
    console.log(`fetch ${url} options`, options);
    const curl = fetchToCurl(url, options);
    console.log(curl);
  }

  return (async () => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (token && response.status === 401) {
          await store.dispatch(signOut());
        }
        throw new FetchJsonError(
          response.status,
          response.statusText,
          response
        );
      }

      let jsend: JSendType;

      try {
        jsend = await response.json();
      } catch (error) {
        throw new FetchJsonError(response.status, error.message, response);
      }

      const { status, message, data } = jsend;

      if (!status) {
        const json = JSON.stringify(jsend, null, 2);
        throw new FetchJsonError(
          response.status,
          `Invalid JSend response - ${json}`,
          response
        );
      }

      if (status !== 'success') {
        throw new FetchJsonError(response.status, message || data, response);
      }

      if (debug) {
        console.log('data', JSON.stringify(data, null, 2));
      }

      next({ ...SUCCESS, payload: data });
      return data;
    } catch (error) {
      const { response, ...rest } = error; // eslint-disable-line
      next({ ...FAILURE, payload: rest });
      const content = error.message || error.statusText;
      await store.dispatch(
        showNotification({
          category: NotificationCategories.ERROR,
          content,
        })
      );

      // TODO add configuration option to optionally re-throw error
      throw error;
    }
  })();
};
