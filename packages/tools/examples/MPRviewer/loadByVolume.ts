import {
  RenderingEngine,
  volumeLoader,
  setVolumesForViewports,
} from '@cornerstonejs/core';

import { setCtTransferFunctionForVolumeActor } from '../../../../utils/demo/helpers';
import C from './constants';
import viewportUtils from './viewportUtils';
import setupGroup from './setupGroup';

async function loadByVolume(
  imageIds: string[],
  elementAxial: HTMLDivElement,
  elementSagittal: HTMLDivElement,
  elementCoronal: HTMLDivElement
) {
  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(C.VOLUME_ID, {
    imageIds,
  });

  const renderingEngine = new RenderingEngine(C.RENDERING_ENGINE_ID);
  const viewportsInput = viewportUtils.createASCViewportsInput(
    elementAxial,
    elementSagittal,
    elementCoronal
  );

  renderingEngine.setViewports(viewportsInput);

  // Set the volume to load
  volume.load();

  // Set volumes on the viewports
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: C.VOLUME_ID,
        callback: setCtTransferFunctionForVolumeActor,
      },
    ],
    C.VIEWPORT_IDS
  );

  setupGroup();

  // Render the image
  renderingEngine.renderViewports(C.VIEWPORT_IDS);
}

export default loadByVolume;
