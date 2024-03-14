import {
  addButtonToToolbar,
  addDropdownToToolbar,
  addToggleButtonToToolbar,
} from '../../../../utils/demo/helpers';
import C from './constants';
import setupSynchronizers from './setupSynchronizers';
import setRenderingMode from './setRenderingMode';
import loadFromLocalFile from './loadFromLocalFile';
import loadFromDicomWeb from './loadFromDicomWeb';
import changeToVolume from './changeToVolume';
import updateUIUtils from './updateUIUtils';

const elementStack = document.createElement('div');
const elementAxial = document.createElement('div');
const elementSagittal = document.createElement('div');
const elementCoronal = document.createElement('div');

let synchronizer;

function setupUI() {
  const SIZE = '500px';

  elementStack.style.width = SIZE;
  elementStack.style.height = SIZE;
  elementAxial.style.width = SIZE;
  elementAxial.style.height = SIZE;
  elementSagittal.style.width = SIZE;
  elementSagittal.style.height = SIZE;
  elementCoronal.style.width = SIZE;
  elementCoronal.style.height = SIZE;

  // Disable right click context menu so we can have right click tools
  elementStack.oncontextmenu = (e) => e.preventDefault();
  elementAxial.oncontextmenu = (e) => e.preventDefault();
  elementSagittal.oncontextmenu = (e) => e.preventDefault();
  elementCoronal.oncontextmenu = (e) => e.preventDefault();

  const content = document.getElementById('content');
  const viewportGrid = document.createElement('div');

  viewportGrid.style.display = 'flex';
  viewportGrid.style.flexDirection = 'row';

  // viewportGrid.appendChild(elementStack);
  viewportGrid.appendChild(elementAxial);
  viewportGrid.appendChild(elementSagittal);
  viewportGrid.appendChild(elementCoronal);

  const form = document.createElement('form');
  const formInput = document.createElement('input');

  formInput.id = C.SELECT_FILE_BUTTON_ID;
  formInput.type = 'file';
  formInput.multiple = true;
  formInput.webkitdirectory = true;
  form.appendChild(formInput);

  content.appendChild(form);
  content.appendChild(viewportGrid);

  document
    .getElementById(C.SELECT_FILE_BUTTON_ID)
    .addEventListener('change', async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files as FileList;

      await loadFromLocalFile(
        files,
        elementAxial,
        elementSagittal,
        elementCoronal
      );
      await changeToVolume();
      updateUIUtils.updateUIAfterDataLoading();
    });

  const instructions = document.createElement('p');

  instructions.innerText = `
    Basic controls:
    - Click/Drag anywhere in the viewport to move the center of the crosshairs.
    - Drag a reference line to move it, scrolling the other views.

    Advanced controls: Hover over a line and find the following two handles:
    - Square (closest to center): Drag these to change the thickness of the MIP slab in that plane.
    - Circle (further from center): Drag these to rotate the axes.
  `;

  content.append(instructions);

  addButtonToToolbar({
    id: C.LOAD_BUTTON_ID,
    title: 'Load data from DicomWeb',
    onClick: () => {
      loadFromDicomWeb(elementAxial, elementSagittal, elementCoronal);
      updateUIUtils.updateUIAfterDataLoading();
    },
  });

  addDropdownToToolbar({
    id: C.BLEND_MODE_BUTTON_ID,
    options: {
      values: [
        C.BLEND_MODE_OPTIONS.MIP,
        C.BLEND_MODE_OPTIONS.MINIP,
        C.BLEND_MODE_OPTIONS.AIP,
      ],
      defaultValue: C.BLEND_MODE_OPTIONS.MIP,
    },
    onSelectedValueChange: setRenderingMode,
  });

  addToggleButtonToToolbar({
    id: C.SYNC_SLAB_THICKNESS_BUTTON_ID,
    title: 'Sync Slab Thickness',
    defaultToggle: false,
    onClick: (toggle) => {
      if (!synchronizer) {
        synchronizer = setupSynchronizers();
      }
      synchronizer.setEnabled(toggle);
    },
  });

  updateUIUtils.disableUIBeforeDataLoading();
}

export default setupUI;
