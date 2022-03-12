(function init() {
  const dimmer2 = document.getElementById('screen-dim2');
  const template = document.querySelector('[bingo-field-template]');
  const grid = document.querySelector('[data-bingo-grid]');
  const rerollbtn = document.querySelector('[data-reroll]');
  const modal = document.querySelector('#edit-modal');
  const cancelbtn = document.querySelector('[data-cancel]');

  const modalHeader = modal.querySelector('[data-modal-header]');
  const modalText = modal.querySelector('[data-text-input]');
  const savebtn = modal.querySelector('[data-save]');

  const editModeBtn = document.querySelector('[data-mode]');
  const editModeBtnText = editModeBtn.querySelector('[data-edit-btn-text]');

  function toggleModal(head = '', text = '') {
    modalHeader.innerText = head;
    modalText.value = text;
    modalText.innerText = text;
    dimmer2.classList.toggle('show');
    modal.classList.toggle('show');
  }
  class BingoField {
    constructor(id, text, element) {
      this.id = id;
      this.text = text;
      this.element = element;
      this.element.dataset.bingoField = id;
      this.displayText = this.element.querySelector('[data-bingo-field-text]');
      this.checkbox = this.element.querySelector('[data-bingo-checkbox]');
      this.checkbox.dataset.bingoField = id;
    }

    edit() {
      toggleModal('Edit field', this.text);
      savebtn.onclick = () => {
        this.text = modalText.value;
        this.displayText.innerText = modalText.value;
        toggleModal();
      };
    }
  }

  function createBingoField(id, text) {
    const field = template.content.cloneNode(true).children[0];
    const fieldObj = new BingoField(id, text, field);
    fieldObj.displayText.innerText = text;
    grid.append(field);
    return fieldObj;
  }

  function saveGrid() {
    const currentGrid = document.querySelectorAll('[data-bingo-field-text]');
    console.log(currentGrid.length);
    const array = Array.from(currentGrid).map((field) => field.innerText);
    localStorage.setItem('currentGrid', JSON.stringify(array));
  }

  function populateGrid() {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    const localStorageKeys = Object.keys(localStorage).filter((card) => card.includes('card'));
    const values = localStorageKeys.map((key) => (localStorage[key]));
    const nums = new Set();
    while (nums.size !== 25) {
      nums.add(Math.floor(Math.random() * values.length));
    }
    const fields = [];
    for (let i = 0; i < 25; i += 1) {
      let element = null;
      if (i === 12) {
        element = createBingoField(i, 'FREE SPACE');
        element.checkbox.checked = true;
      } else {
        const idx = Array.from(nums)[i];
        element = createBingoField(i, values[idx]);
      }
      fields.push(element);
    }
    fields.forEach((field) => field.checkbox.addEventListener('change', () => {
      // only display confetti on check and not on uncheck.
      if (field.checkbox.checked) {
        checkWin(fields);
      }
    }));

    saveGrid();
    return fields;
  }

  function loadGrid() {
    const content = JSON.parse(localStorage.getItem('currentGrid'));
    const fields = [];
    for (let i = 0; i < content.length; i += 1) {
      const element = content[i];
      const field = createBingoField(i, element);
      fields.push(field);
    }
    fields[12].checkbox.checked = true;

    fields.forEach((field) => field.checkbox.addEventListener('change', () => {
      // only display confetti on check and not on uncheck.
      if (field.checkbox.checked) {
        checkWin(fields);
      }
    }));
    return fields;
  }

  function toggleEditMode(fields) {
    if (editModeBtn.dataset.mode === '') {
      editModeBtn.dataset.mode = 'edit';

      editModeBtnText.innerText = 'Stop editing';

      // I have no clue how to do this another way
      // eslint-disable-next-line no-return-assign
      fields.forEach((field) => field.element.addEventListener('click', field.editmode = function editmode() { field.edit(); }, false));
    } else {
      editModeBtn.dataset.mode = '';
      editModeBtnText.innerText = 'Edit';
      fields.forEach((field) => field.element.removeEventListener('click', field.editmode));
    }

    fields.forEach((field) => {
      const el = field;
      el.checkbox.classList.toggle('input-disabled');
    });
  }

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

  function checkWin(fields) {
    // get all ids of checked bingo fields
    const checked = fields.filter((field) => field.checkbox.checked === true)
      .map((field) => field.id);
    // console.log(checked);
    // start evaluating once 5 or more are checked
    if (checked.length >= 5) {
      for (let i = 0; i < winnningRows.length; i += 1) {
        const row = winnningRows[i];
        if (row.every((field) => checked.includes(field))) {
          // console.log('win');
          // eslint-disable-next-line no-undef
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          // stop evaluating once we got a win
          break;
        }
      }
    }
  }

  // savebtn.onclick = saveGrid;
  cancelbtn.onclick = toggleModal;
  dimmer2.onclick = toggleModal;

  let fields = [];
  // TODO: validate localstorage
  if (localStorage.getItem('currentGrid')) {
    fields = loadGrid();
    console.log(fields);
  } else {
    // TODO: check if there are even any cards.
    fields = populateGrid();
    console.log(fields);
  }
  const saveGridBtn = document.querySelector('[data-save-grid]');
  saveGridBtn.addEventListener('click', () => { checkWin(fields); });

  rerollbtn.addEventListener('click', () => {
    fields = populateGrid();
  });
  // this is the modal btn. change this.
  editModeBtn.addEventListener('click', () => {
    toggleEditMode(fields);
  });
}());
