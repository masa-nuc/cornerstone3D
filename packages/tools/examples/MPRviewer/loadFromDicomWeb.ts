import { imageLoader } from '@cornerstonejs/core';
import { createImageIdsAndCacheMetaData } from '../../../../utils/demo/helpers';

import loadByVolume from './loadByVolume';
import loadByStack from './loadByStack';
import changeToVolume from './changeToVolume';

// Original example uses the volumeLoader.createAndCacheVolume function.
// But, it cannot load the DICOM files from the local storage.
// I could not find it.
// To use the MPR feature, loads the files by Stack, then change them to volume.
// If there is another better way, this example wants to use it.
const useVolume = false;

async function loadFromDicomWeb(
  elementAxial: HTMLDivElement,
  elementSagittal: HTMLDivElement,
  elementCoronal: HTMLDivElement
) {
  // Get Cornerstone imageIds for the source data and fetch metadata into RAM
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
  });

  if (useVolume) {
    await loadByVolume(imageIds, elementAxial, elementSagittal, elementCoronal);
  } else {
    imageLoader.createAndCacheDerivedImages(imageIds);
    await loadByStack(imageIds, elementAxial, elementSagittal, elementCoronal);
    await changeToVolume();
  }
}

export default loadFromDicomWeb;
