import * as cornerstoneTools from '@cornerstonejs/tools';

import C from './constants';

const { synchronizers } = cornerstoneTools;
const { createSlabThicknessSynchronizer } = synchronizers;

function setupSynchronizers() {
  const synchronizer = createSlabThicknessSynchronizer(C.SYNCHRONIZER_ID);

  // Add viewports to VOI synchronizers
  C.VIEWPORT_IDS.forEach((viewportId) => {
    synchronizer.add({
      renderingEngineId: C.RENDERING_ENGINE_ID,
      viewportId,
    });
  });

  // Normally this would be left on, but here we are starting the demo in the
  // default state, which is to not have a synchronizer enabled.
  synchronizer.setEnabled(false);

  return synchronizer;
}

export default setupSynchronizers;
