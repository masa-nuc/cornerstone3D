import { Enums, Types } from '@cornerstonejs/core';
import { RenderingEngine } from '@cornerstonejs/core';

import C from './constants';
import viewportUtils from './viewportUtils';
import setupGroup from './setupGroup';

async function loadByStack(
  imageIds: string[],
  elementAxial: HTMLDivElement,
  elementSagittal: HTMLDivElement,
  elementCoronal: HTMLDivElement
) {
  const renderingEngine = new RenderingEngine(C.RENDERING_ENGINE_ID);
  const viewportsInput = viewportUtils.createASCViewportsInput(
    elementAxial,
    elementSagittal,
    elementCoronal,
    Enums.ViewportType.STACK
  );

  renderingEngine.setViewports(viewportsInput);

  for (const viewportId of C.VIEWPORT_IDS) {
    const viewport = <Types.IStackViewport>(
      renderingEngine.getViewport(viewportId)
    );

    // Define a stack containing a single image
    const stack = imageIds;

    await viewport.setStack(stack, 0);
  }

  setupGroup();
}

export default loadByStack;
