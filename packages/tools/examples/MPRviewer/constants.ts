import { Enums, Types } from '@cornerstonejs/core';

const LOAD_BUTTON_ID = 'dataLoadId';
const BLEND_MODE_BUTTON_ID = 'blendModeId';
const SYNC_SLAB_THICKNESS_BUTTON_ID = 'syncSlabThicknessId';
const SELECT_FILE_BUTTON_ID = 'selectFileId';

const TOOL_GROUP_ID = 'myGroupId';
const STACK_TOOL_GROUP_ID = 'myStackToolGroupId';
const RENDERING_ENGINE_ID = 'myRenderingEngineId';

const VP_AXIAL_ID = 'viewportAxialId';
const VP_SAGITTAL_ID = 'viewportSagittalId';
const VP_CORONAL_ID = 'viewportCoronalId';
const VIEWPORT_IDS = [VP_AXIAL_ID, VP_SAGITTAL_ID, VP_CORONAL_ID];

const VOLUME_NAME = 'volumeName';
const VOLUME_LOADER_SCHEME = 'cornerstoneStreamingImageVolume';
const VOLUME_ID = `${VOLUME_LOADER_SCHEME}:${VOLUME_NAME}`;

const SYNCHRONIZER_ID = 'slabThicknessSynchId';

const COLOR_GREEN = <Types.Point3>[0, 0.4, 0];
const COLOR_PURPLE = <Types.Point3>[0.4, 0, 0.4];
const COLOR_BLACK = <Types.Point3>[0, 0, 0];
const RGB_RED = 'rgb(200, 0, 0)';
const RGB_YELLOW = 'rgb(200, 200, 0)';
const RGB_GREEN = 'rgb(0, 200, 0)';

const BLEND_MODE_OPTIONS = {
  MIP: 'Maximum Intensity Projection',
  MINIP: 'Minimum Intensity Projection',
  AIP: 'Average Intensity Projection',
};

const ORIENTATION_OPTIONS = {
  AXIAL: Enums.OrientationAxis.AXIAL,
  SAGITTAL: Enums.OrientationAxis.SAGITTAL,
  CORONAL: Enums.OrientationAxis.CORONAL,
};

const VP_ORIENTATION = {
  [VP_AXIAL_ID]: Enums.OrientationAxis.AXIAL,
  [VP_SAGITTAL_ID]: Enums.OrientationAxis.SAGITTAL,
  [VP_CORONAL_ID]: Enums.OrientationAxis.CORONAL,
};

const constants = {
  LOAD_BUTTON_ID,
  BLEND_MODE_BUTTON_ID,
  SYNC_SLAB_THICKNESS_BUTTON_ID,
  SELECT_FILE_BUTTON_ID,
  TOOL_GROUP_ID,
  STACK_TOOL_GROUP_ID,
  RENDERING_ENGINE_ID,
  VP_AXIAL_ID,
  VP_SAGITTAL_ID,
  VP_CORONAL_ID,
  VIEWPORT_IDS,
  VOLUME_NAME,
  VOLUME_LOADER_SCHEME,
  VOLUME_ID,
  SYNCHRONIZER_ID,
  COLOR_GREEN,
  COLOR_PURPLE,
  COLOR_BLACK,
  RGB_RED,
  RGB_YELLOW,
  RGB_GREEN,
  BLEND_MODE_OPTIONS,
  ORIENTATION_OPTIONS,
  VP_ORIENTATION,
};

export default constants;
