import * as cornerstoneTools from '@cornerstonejs/tools';

import C from './constants';
import crosshairConfig from './crosshairConfig';

const {
  ToolGroupManager,
  Enums: csToolsEnums,
  CrosshairsTool,
} = cornerstoneTools;
const { MouseBindings } = csToolsEnums;

import { addManipulationBindings } from '../../../../utils/demo/helpers';

function setupGroup() {
  // Define tool groups to add the segmentation display tool to
  const toolGroup = ToolGroupManager.createToolGroup(C.TOOL_GROUP_ID);

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(CrosshairsTool);

  addManipulationBindings(toolGroup);

  // For the crosshairs to operate, the viewports must currently be
  // added ahead of setting the tool active. This will be improved in the future.
  toolGroup.addViewport(C.VP_AXIAL_ID, C.RENDERING_ENGINE_ID);
  toolGroup.addViewport(C.VP_SAGITTAL_ID, C.RENDERING_ENGINE_ID);
  toolGroup.addViewport(C.VP_CORONAL_ID, C.RENDERING_ENGINE_ID);

  // Manipulation Tools
  // Add Crosshairs tool and configure it to link the three viewports
  // These viewports could use different tool groups. See the PET-CT example
  // for a more complicated used case.

  toolGroup.addTool(CrosshairsTool.toolName, crosshairConfig);
  toolGroup.setToolActive(CrosshairsTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });
}

export default setupGroup;
