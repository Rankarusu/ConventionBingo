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

  rerollbtn.onclick = populateGrid;
  savebtn.onclick = saveGrid;
  cancelbtn.onclick = toggleModal;
  dimmer2.onclick = toggleModal;

  let fields = [];
  // TODO: validate localstorage
  if (localStorage.getItem('currentGrid')) {
    fields = loadGrid();
    console.log(fields);
  } else {
    fields = populateGrid();
    console.log(fields);
  }

  editModeBtn.addEventListener('click', () => { toggleEditMode(fields); });
}());
