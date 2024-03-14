import { setUseSharedArrayBuffer } from '@cornerstonejs/core';
import {
  initDemo,
  setTitleAndDescription,
} from '../../../../utils/demo/helpers';
import setupUI from './setupUI';

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->'
);

setTitleAndDescription('MPR viewer', 'MPR test application');

async function run() {
  // Init Cornerstone and related libraries
  await initDemo();

  setUseSharedArrayBuffer(false);

  setupUI();
}

run();
