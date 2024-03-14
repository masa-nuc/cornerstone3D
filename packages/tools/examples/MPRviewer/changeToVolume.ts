import {
  getRenderingEngine,
  utilities as csUtils,
  setVolumesForViewports,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import { setCtTransferFunctionForVolumeActor } from '../../../../utils/demo/helpers';
import C from './constants';
import viewportUtils from './viewportUtils';
import setOrientation from './setOrientation';

const { ToolGroupManager } = cornerstoneTools;

async function changeToVolume() {
  const toolGroup = ToolGroupManager.getToolGroup(C.TOOL_GROUP_ID);
  const renderingEngine = getRenderingEngine(C.RENDERING_ENGINE_ID);

  for (const viewportId of C.VIEWPORT_IDS) {
    const viewport = renderingEngine.getViewport(viewportId);
    const vpi = viewportUtils.createS2VViewportInput(viewport);
    const newViewport = await csUtils.convertStackToVolumeViewport(vpi);

    toolGroup.addViewport(newViewport.id, C.RENDERING_ENGINE_ID);
  }

  setTimeout(async () => {
    for (const viewportId of C.VIEWPORT_IDS) {
      setOrientation(viewportId, C.VP_ORIENTATION[viewportId]);
    }

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

    renderingEngine.renderViewports(C.VIEWPORT_IDS);
  });
}

export default changeToVolume;
