/* @flow */

import { Application } from 'spectron';
import path from 'path';

import debug from 'debug';
const d = debug('mykrobe:desktop-test:test-open-source-file');

import { extensionForFileName } from '../../app/util';

import { TIMEOUT, delay, EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH } from './util';

import createTestHelpers from './helpers';

const testOpenSourceFile = async (
  source: string,
  exemplarSamplesExpectEntry: any,
  app: Application
) => {
  if (!app) {
    throw 'Missing argument app';
  }
  const { isExisting, textForSelector, saveScreenshot } = createTestHelpers(
    app
  );
  const { client, webContents } = app;
  const filePath = path.join(EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH, source);
  const extension = extensionForFileName(source);
  const isJson = extension === '.json';

  // send file > open event
  webContents.send('open-file', filePath);

  if (!isJson) {
    // await UI change
    await delay(500);

    // check existence of cancel button
    expect(await isExisting('[data-tid="button-analyse-cancel"]')).toBe(true);

    // check status text
    expect(
      (await client.element('[data-tid="status-text"]').getText()).toLowerCase()
    ).toBe('analysing');

    // TODO check for progress changes once reinstated
  }

  if (exemplarSamplesExpectEntry.expect.reject) {
    d('awaiting rejection');
    d(
      'exemplarSamplesExpectEntry.expect',
      JSON.stringify(exemplarSamplesExpectEntry.expect, null, 2)
    );
    // should display an error notification rejecting this file
    await client.waitForVisible(
      '[data-tid="component-notification-content"]',
      TIMEOUT
    );
    const notifications = await textForSelector(
      '[data-tid="component-notification-content"]'
    );
    await saveScreenshot(`${source}__rejection__.png`);
    expect(
      notifications[0].includes('does not give susceptibility predictions')
    ).toBeTruthy();
  } else {
    // wait for results to appear
    await client.waitForVisible('[data-tid="component-resistance"]', TIMEOUT);
  }
};

export default testOpenSourceFile;
