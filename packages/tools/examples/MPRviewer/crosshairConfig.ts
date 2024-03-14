import C from './constants';

const VIEWPORT_COLORS = {
  [C.VP_AXIAL_ID]: C.RGB_RED,
  [C.VP_SAGITTAL_ID]: C.RGB_YELLOW,
  [C.VP_CORONAL_ID]: C.RGB_GREEN,
};

const viewportReferenceLineControllable = [
  C.VP_AXIAL_ID,
  C.VP_SAGITTAL_ID,
  C.VP_CORONAL_ID,
];

const viewportReferenceLineDraggableRotatable = [
  C.VP_AXIAL_ID,
  C.VP_SAGITTAL_ID,
  C.VP_CORONAL_ID,
];

const viewportReferenceLineSlabThicknessControlsOn = [
  C.VP_AXIAL_ID,
  C.VP_SAGITTAL_ID,
  C.VP_CORONAL_ID,
];

function getReferenceLineColor(viewportId) {
  return VIEWPORT_COLORS[viewportId];
}

function getReferenceLineControllable(viewportId) {
  const index = viewportReferenceLineControllable.indexOf(viewportId);
  return index !== -1;
}

function getReferenceLineDraggableRotatable(viewportId) {
  const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
  return index !== -1;
}

function getReferenceLineSlabThicknessControlsOn(viewportId) {
  const index =
    viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
  return index !== -1;
}

const crosshairConfig = {
  getReferenceLineColor,
  getReferenceLineControllable,
  getReferenceLineDraggableRotatable,
  getReferenceLineSlabThicknessControlsOn,
};

export default crosshairConfig;
