import { Enums, Types, getRenderingEngine } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import C from './constants';

const { ToolGroupManager, CrosshairsTool } = cornerstoneTools;

function setRenderingMode(selectedValue) {
  let blendModeToUse;

  switch (selectedValue) {
    case C.BLEND_MODE_OPTIONS.MIP:
      blendModeToUse = Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
      break;
    case C.BLEND_MODE_OPTIONS.MINIP:
      blendModeToUse = Enums.BlendModes.MINIMUM_INTENSITY_BLEND;
      break;
    case C.BLEND_MODE_OPTIONS.AIP:
      blendModeToUse = Enums.BlendModes.AVERAGE_INTENSITY_BLEND;
      break;
    default:
      throw new Error('undefined orientation option');
  }

  const toolGroup = ToolGroupManager.getToolGroup(C.TOOL_GROUP_ID);
  const crosshairsInstance = toolGroup.getToolInstance(CrosshairsTool.toolName);
  const oldConfiguration = crosshairsInstance.configuration;

  crosshairsInstance.configuration = {
    ...oldConfiguration,
    slabThicknessBlendMode: blendModeToUse,
  };

  // Update the blendMode for actors to instantly reflect the change
  toolGroup.viewportsInfo.forEach(({ viewportId, renderingEngineId }) => {
    const renderingEngine = getRenderingEngine(renderingEngineId);
    const viewport = renderingEngine.getViewport(
      viewportId
    ) as Types.IVolumeViewport;

    viewport.setBlendMode(blendModeToUse);
    viewport.render();
  });
}

export default setRenderingMode;
