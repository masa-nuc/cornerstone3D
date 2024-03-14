import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import { prefetchMetadataInformation } from '../../../../utils/demo/helpers/convertMultiframeImageIds';
import loadByStack from './loadByStack';

async function loadFromLocalFile(
  files: FileList,
  elementAxial: HTMLDivElement,
  elementSagittal: HTMLDivElement,
  elementCoronal: HTMLDivElement
) {
  const imageIds = [];

  for (const file of files) {
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
    imageIds.push(imageId);
  }

  await prefetchMetadataInformation(imageIds);
  await loadByStack(imageIds, elementAxial, elementSagittal, elementCoronal);
}

export default loadFromLocalFile;
