import {
  RenderingEngine,
  Types,
  Enums,
  imageLoader,
  getRenderingEngine,
  utilities as csUtils,
  setUseSharedArrayBuffer,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import {
  initDemo,
  createImageIdsAndCacheMetaData,
  setTitleAndDescription,
  addDropdownToToolbar,
  addButtonToToolbar,
} from '../../../../utils/demo/helpers';
import { prefetchMetadataInformation } from '../../../../utils/demo/helpers/convertMultiframeImageIds';

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->'
);

const {
  PanTool,
  ZoomTool,
  StackScrollTool,
  ToolGroupManager,
  StackScrollMouseWheelTool,
  Enums: csToolsEnums,
  utilities,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

const LOAD_BUTTON_ID = 'dataLoadId';
const SELECT_FILE_BUTTON_ID = 'selectFileId';
const SWITCH_BUTTON_ID = 'stackVolumeSwitchButtonId';

const RENDERING_ENGINE_ID = 'myRenderingEngineId';
const VIEWPORT_ID = 'viewportId';
const STACK_TOOL_GROUP_ID = 'stackToolGroupId';
const VOLUME_TOOL_GROUP_ID = 'volumeToolGroupId';
const VOLUME_DICOM_ID = 'cornerstoneStreamingImageVolume:localDICOM';
const ORIENTATION_OPTIONS = {
  AXIAL: 'axial',
  SAGITTAL: 'sagittal',
  CORONAL: 'coronal',
};
const DEFAULT_ORIENTATION = ORIENTATION_OPTIONS.CORONAL;
const COLOR_GREEN = <Types.Point3>[0, 0.4, 0];
const COLOR_PURPLE = <Types.Point3>[0.4, 0, 0.4];
const SIZE = '500px';

// ======== Set up page ======== //
setTitleAndDescription(
  'Stack and Volume conversions',
  'In this demo, you see how the stack and volume conversions work.'
);

const content = document.getElementById('content');
const element = document.createElement('div');

// Disable right click context menu so we can have right click tools
element.oncontextmenu = (e) => e.preventDefault();

element.id = 'cornerstone-element';
element.style.width = SIZE;
element.style.height = SIZE;

const form = document.createElement('form');
const formInput = document.createElement('input');

formInput.id = SELECT_FILE_BUTTON_ID;
formInput.type = 'file';
formInput.multiple = true;
formInput.webkitdirectory = true;

form.appendChild(formInput);

content.appendChild(form);
content.appendChild(element);

// ============================= //

function createInitialStackViewportInput() {
  return {
    viewportId: VIEWPORT_ID,
    type: ViewportType.STACK,
    element,
    defaultOptions: {
      background: COLOR_PURPLE,
    },
  };
}

function createS2VViewportInput(viewport) {
  return {
    viewport: viewport as Types.IStackViewport,
    options: {
      background: COLOR_GREEN,
      volumeId: VOLUME_DICOM_ID,
    },
  };
}

function createV2SViewportInput(viewport) {
  return {
    viewport: viewport as Types.IVolumeViewport,
    options: {
      background: COLOR_PURPLE,
    },
  };
}

async function changeToVolume(viewport) {
  const vpi = createS2VViewportInput(viewport);
  const newViewport = await csUtils.convertStackToVolumeViewport(vpi);
  const toolGroup = ToolGroupManager.getToolGroup(VOLUME_TOOL_GROUP_ID);

  if (toolGroup) {
    toolGroup.addViewport(newViewport.id, RENDERING_ENGINE_ID);
  }
}

async function changeToStack(viewport) {
  const vpi = createV2SViewportInput(viewport);
  const newViewport = await csUtils.convertVolumeToStackViewport(vpi);
  const toolGroup = ToolGroupManager.getToolGroup(STACK_TOOL_GROUP_ID);

  if (toolGroup) {
    toolGroup.addViewport(newViewport.id, RENDERING_ENGINE_ID);
  }
}

addButtonToToolbar({
  id: LOAD_BUTTON_ID,
  title: 'Load data from DicomWeb',
  onClick: loadFromDicomWeb,
});

addButtonToToolbar({
  id: SWITCH_BUTTON_ID,
  title: 'Switch StackViewport to VolumeViewport, and vice versa',
  onClick: toggleMode,
}).setAttribute('disabled', 'true');

async function toggleMode() {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(RENDERING_ENGINE_ID);
  const viewport = renderingEngine.getViewport(VIEWPORT_ID);

  if (viewport.type === ViewportType.STACK) {
    await changeToVolume(viewport);

    // To apply the orientation, it needs to call the setOrientation, after a while.
    // Otherwise, this request will be ignored.
    setTimeout(() => setOrientation(DEFAULT_ORIENTATION));
  } else {
    await changeToStack(viewport);
  }

  addOrientationDropdownIfVolumeViewport();
}

async function loadFromDicomWeb() {
  // Get Cornerstone imageIds and fetch metadata into RAM
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
  });

  await imageLoader.createAndCacheDerivedImages(imageIds);

  const renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);

  await _startFromStack(imageIds, renderingEngine);
  await toggleMode();

  updateUIAfterDataLoading();
}

document
  .getElementById(SELECT_FILE_BUTTON_ID)
  .addEventListener('change', async function (e: any) {
    // Add the file to the cornerstoneFileImageLoader and get unique
    // number for that file
    const imageIds = [];

    for (const file of e.target.files) {
      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    }

    await prefetchMetadataInformation(imageIds);

    const renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);

    await _startFromStack(imageIds, renderingEngine);
    await toggleMode();

    updateUIAfterDataLoading();
  });

function updateUIAfterDataLoading() {
  // disable data load buttons, once one of them loads the data.
  [LOAD_BUTTON_ID, SELECT_FILE_BUTTON_ID].forEach((id) => {
    document.getElementById(id).setAttribute('disabled', 'true');
  });
  // enable the stack <-> volume switch button
  document.getElementById(SWITCH_BUTTON_ID).removeAttribute('disabled');
}

async function _startFromStack(
  imageIds: string[],
  renderingEngine: RenderingEngine
) {
  // Instantiate a rendering engine
  // Create a stack viewport
  const viewportInput = createInitialStackViewportInput();
  const toolGroup = ToolGroupManager.getToolGroup(STACK_TOOL_GROUP_ID);

  renderingEngine.enableElement(viewportInput);

  // Set the tool group on the viewport
  if (toolGroup) {
    toolGroup.addViewport(VIEWPORT_ID, RENDERING_ENGINE_ID);
  }

  // Get the stack viewport that was created
  const viewport = <Types.IStackViewport>(
    renderingEngine.getViewport(VIEWPORT_ID)
  );

  // Define a stack containing a single image
  const stack = imageIds;

  await viewport.setStack(stack, 0);

  // Without this code, paging becomes jerky.
  utilities.stackContextPrefetch.enable(viewport.element);

  renderingEngine.render();
}

function addOrientationDropdownIfVolumeViewport() {
  const renderingEngine = getRenderingEngine(RENDERING_ENGINE_ID);
  const vp = renderingEngine.getViewport(VIEWPORT_ID);
  const id = 'orientationDropdown';

  // Check if the current viewport is a VolumeViewport
  if (vp.type === ViewportType.ORTHOGRAPHIC) {
    addDropdownToToolbar({
      id,
      options: {
        values: [
          ORIENTATION_OPTIONS.AXIAL,
          ORIENTATION_OPTIONS.SAGITTAL,
          ORIENTATION_OPTIONS.CORONAL,
        ],
        defaultValue: DEFAULT_ORIENTATION,
      },
      onSelectedValueChange: setOrientation,
    });
  } else {
    // remove old orientationDropdown
    document.getElementById(id)?.remove();
  }
}

function setOrientation(orientation) {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(RENDERING_ENGINE_ID);
  // Get the volume viewport
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(VIEWPORT_ID)
  );

  switch (orientation) {
    case ORIENTATION_OPTIONS.AXIAL:
      viewport.setOrientation(Enums.OrientationAxis.AXIAL);
      break;
    case ORIENTATION_OPTIONS.SAGITTAL:
      viewport.setOrientation(Enums.OrientationAxis.SAGITTAL);
      break;
    case ORIENTATION_OPTIONS.CORONAL:
      viewport.setOrientation(Enums.OrientationAxis.CORONAL);
      break;
    default:
      throw new Error('undefined orientation option');
  }
  // TODO -> Maybe we should have a helper for this on the viewport
  // Set the new orientation
  // Reset the camera after the normal changes
  viewport.render();
}

/**
 * Runs the demo
 */
async function run() {
  // Init Cornerstone and related libraries
  await initDemo();

  setUseSharedArrayBuffer(false);

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(StackScrollTool);
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const stackTG = ToolGroupManager.createToolGroup(STACK_TOOL_GROUP_ID);
  const volumeTG = ToolGroupManager.createToolGroup(VOLUME_TOOL_GROUP_ID);

  [stackTG, volumeTG].forEach((toolGroup) => {
    // Add the tools to the tool group
    toolGroup.addTool(StackScrollTool.toolName);
    toolGroup.addTool(StackScrollMouseWheelTool.toolName);
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);

    // Set the initial state of the tools, here we set one tool active on left click.
    // This means left click will draw that tool.
    toolGroup.setToolActive(StackScrollTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary,
        },
      ],
    });
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Secondary,
        },
      ],
    });
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Auxiliary,
        },
      ],
    });
    toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  });
}

run();
