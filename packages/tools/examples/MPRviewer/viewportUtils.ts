import { Enums, Types } from '@cornerstonejs/core';

import C from './constants';

function createASCViewportsInput(
  elementAxial: HTMLDivElement,
  elementSagittal: HTMLDivElement,
  elementCoronal: HTMLDivElement,
  type = Enums.ViewportType.ORTHOGRAPHIC
): Array<Types.PublicViewportInput> {
  // Create the viewports
  const viewportInputArray = [
    {
      viewportId: C.VP_AXIAL_ID,
      type,
      element: elementAxial,
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
        background: C.COLOR_BLACK,
      },
    },
    {
      viewportId: C.VP_SAGITTAL_ID,
      type,
      element: elementSagittal,
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
        background: C.COLOR_BLACK,
      },
    },
    {
      viewportId: C.VP_CORONAL_ID,
      type,
      element: elementCoronal,
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
        background: C.COLOR_BLACK,
      },
    },
  ];

  return viewportInputArray;
}

function createS2VViewportInput(viewport) {
  return {
    viewport: viewport as Types.IStackViewport,
    options: {
      background: C.COLOR_GREEN,
      volumeId: C.VOLUME_ID,
    },
  };
}

const viewportUtils = {
  createASCViewportsInput,
  createS2VViewportInput,
};

export default viewportUtils;
