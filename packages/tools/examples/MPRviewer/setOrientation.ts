import { Types, getRenderingEngine } from '@cornerstonejs/core';

import C from './constants';

function setOrientation(viewportId, orientation) {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(C.RENDERING_ENGINE_ID);

  // Get the volume viewport
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(viewportId)
  );

  viewport.setOrientation(orientation);
  viewport.render();
}

export default setOrientation;
