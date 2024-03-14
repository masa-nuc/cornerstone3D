import C from './constants';

const disableDefault = [
  C.BLEND_MODE_BUTTON_ID,
  C.SYNC_SLAB_THICKNESS_BUTTON_ID,
];
const enableDefault = [C.LOAD_BUTTON_ID, C.SELECT_FILE_BUTTON_ID];

function disableUIBeforeDataLoading() {
  disableDefault.forEach((id) => {
    document.getElementById(id).setAttribute('disabled', 'true');
  });
}

function updateUIAfterDataLoading() {
  // disable data load buttons, once one of them loads the data.
  enableDefault.forEach((id) => {
    document.getElementById(id).setAttribute('disabled', 'true');
  });

  disableDefault.forEach((id) => {
    document.getElementById(id).removeAttribute('disabled');
  });
}

const updateUIUtils = {
  disableUIBeforeDataLoading,
  updateUIAfterDataLoading,
};

export default updateUIUtils;
