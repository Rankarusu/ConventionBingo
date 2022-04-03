/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
import { showMessage, checkCards, bingoFieldTemplate } from './utils.js';

(async function init() {
  const dimmer2 = document.getElementById('screen-dim2');

  const template = document.createElement('template');
  template.innerHTML = bingoFieldTemplate.trim();

  const grid = document.querySelector('[data-bingo-grid]');
  const rerollbtn = document.querySelector('[data-reroll]');
  const modal = document.querySelector('#edit-modal');

  const modalHeader = modal.querySelector('[data-modal-header]');
  const modalText = modal.querySelector('[data-text-input]');
  const savebtn = modal.querySelector('[data-save]');
  const cancelbtn = modal.querySelector('[data-cancel]');

  const editModeBtn = document.querySelector('[data-mode]');
  const editModeBtnText = editModeBtn.querySelector('[data-edit-btn-text]');
  const editModeBtnIcon = editModeBtn.querySelector('[data-edit-btn-icon]');
  const winnningRows = [
    // horizontal rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],

    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],

    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  const lsFields = await checkCards();

  function toggleModal(head = '', text = '') {
    modalHeader.innerText = head;
    modalText.value = text;
    modalText.innerText = text;
    dimmer2.classList.toggle('show');
    modal.classList.toggle('show');
    window.setTimeout(() => modalText.focus(), 100);
    // automatically places cursor into the modal. timeout is needed for whatever reason.
  }
  class BingoField {
    constructor(id, text, element, checked = false) {
      this.id = id;
      this.text = text;
      this.element = element;
      this.element.dataset.bingoField = id;
      this.displayText = this.element.querySelector('[data-bingo-field-text]');
      this.checkbox = this.element.querySelector('[data-bingo-checkbox]');
      this.checkbox.checked = checked;
      this.checkbox.dataset.bingoField = id;
    }

    edit() {
      toggleModal('Edit field', this.text);
      savebtn.onclick = () => {
        this.text = modalText.value;
        this.displayText.innerText = modalText.value;
        toggleModal();
        // eslint-disable-next-line no-use-before-define
        saveGrid(fields);
      };
    }
  }

  function createBingoField(id, text, checked) {
    const field = template.content.cloneNode(true).children[0];
    const fieldObj = new BingoField(id, text, field, checked);
    fieldObj.displayText.innerText = text;
    grid.append(field);
    return fieldObj;
  }

  function saveGrid(fields, name = 'currentSheet') {
    const sheetObj = fields.map((field) => {
      const fieldObj = {
        id: field.id,
        text: field.text,
        checked: field.checkbox.checked,
      };
      return fieldObj;
    });

    localStorage.setItem(name, JSON.stringify(sheetObj));
  }

  function saveGridWithId(fields) {
    const localStorageSheets = Object.keys(localStorage).filter((sheet) => sheet.includes('sheet'));
    // get highest ID
    let highestIndex = 0;
    if (localStorageSheets.length > 0) {
      // extract highest number from sheets in localstorage
      const indices = localStorageSheets.map((sheet) => parseInt(sheet.replace(/^\D+/g, ''), 10));
      highestIndex = Math.max(...indices);
    }
    saveGrid(fields, `sheet${highestIndex + 1}`);
  }

  function checkWin(fields, checkedItem) {
    // get all ids of checked bingo fields
    const checked = fields.filter((field) => field.checkbox.checked === true)
      .map((field) => field.id);

    // start evaluating once 5 or more are checked
    if (checked.length >= 5) {
      for (let i = 0; i < winnningRows.length; i += 1) {
        const row = winnningRows[i];
        if (row.every((field) => checked.includes(field)) && row.includes(checkedItem.id)) {
          // eslint-disable-next-line no-undef
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          showMessage('winner winner chicken dinner!');
          // stop evaluating once we got a win
          break;
        }
      }
    }
  }

  function populateGrid() {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    const lsKeys = Object.keys(lsFields);
    // i need the utility of indices for the random selection so this is kinda mandatory.
    const lsValues = lsKeys.map((key) => (lsFields[key]));
    // make a set of 25 random numbers that are no higher than the amount of fields in ls.
    let nums = new Set();
    while (nums.size !== 25) {
      nums.add(Math.floor(Math.random() * lsKeys.length));
    }

    nums = Array.from(nums);
    const fields = [];
    for (let i = 0; i < 25; i += 1) {
      let element = null;
      if (i === 12) {
        element = createBingoField(i, 'FREE SPACE');
        element.checkbox.checked = true;
      } else {
        const idx = nums[i];
        element = createBingoField(i, lsValues[idx]);
      }
      fields.push(element);
    }
    fields.forEach((field) => field.checkbox.addEventListener('change', () => {
      // only display confetti on check and not on uncheck.
      if (field.checkbox.checked) {
        checkWin(fields, field);
      }
      saveGrid(fields);
    }));

    saveGrid(fields);
    return fields;
  }

  function loadGrid() {
    const content = JSON.parse(localStorage.getItem('currentSheet'));
    const fields = [];

    content.forEach((field) => {
      const element = createBingoField(field.id, field.text, field.checked);
      element.checkbox.addEventListener('change', () => {
        if (element.checkbox.checked) {
          checkWin(fields, field);
        }
        saveGrid(fields);
      });
      fields.push(element);
    });
    return fields;
  }

  function toggleEditMode(fields) {
    if (editModeBtn.dataset.mode === '') {
      editModeBtn.dataset.mode = 'edit';

      editModeBtnText.innerText = 'Resume';
      editModeBtnIcon.innerText = 'edit_off';

      // I have no clue how to do this another way
      // eslint-disable-next-line no-return-assign
      fields.forEach((field) => field.element.addEventListener('click', field.editmode = function editmode() { field.edit(); }, false));
    } else {
      editModeBtn.dataset.mode = '';
      editModeBtnText.innerText = 'Edit';
      editModeBtnIcon.innerText = 'edit';
      fields.forEach((field) => field.element.removeEventListener('click', field.editmode));
    }

    fields.forEach((field) => {
      const el = field;
      el.checkbox.classList.toggle('bingo-field__input--disabled');
    });
  }

  // cancelbtn.onclick = toggleModal;
  cancelbtn.addEventListener('click', () => { toggleModal(); });
  dimmer2.addEventListener('click', () => { toggleModal(); });

  let fields = [];
  // TODO: validate localstorage completely
  if (localStorage.getItem('currentSheet')) {
    fields = loadGrid();
  } else {
    fields = populateGrid();
  }

  const saveGridBtn = document.querySelector('[data-save-grid]');

  saveGridBtn.addEventListener('click', () => {
    saveGridWithId(fields);
    showMessage('sheet saved!');
  });

  rerollbtn.addEventListener('click', () => {
    fields = populateGrid();
  });

  editModeBtn.addEventListener('click', () => {
    toggleEditMode(fields);
  });
}());
