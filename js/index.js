function init() {
  const template = document.querySelector('[bingo-field-template]');
  const grid = document.querySelector('[data-bingo-grid]');

  class BingoField {
    constructor(id, text, element) {
      this.text = text;
      this.element = element;
      this.id = id;
      this.element.dataset.bingoField = id;
      this.displayText = this.element.querySelector('[data-text]');
      this.checkbox = this.element.querySelector('[data-bingo-checkbox]');
    }

    edit() {
      // toggleOverlay
      // this.text = modalText.value;
      // this.displyText = modalText.value;
      // toggleOverlay
    }
  }

  function createBingoField(id, text) {
    const field = template.content.cloneNode(true).children[0];
    const fieldObj = new BingoField(id, text, field);
    fieldObj.displayText.innerText = text;
    grid.append(field);
    return fieldObj;
  }

  function populateGrid() {
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
    const currentGrid = document.querySelectorAll('[data-text]');
    const array = Array.from(currentGrid).map((field) => field.innerText);
    localStorage.setItem('currentGrid', JSON.stringify(array));
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
  }

  if (localStorage.getItem('currentGrid')) {
    loadGrid();
  } else {
    populateGrid();
  }
}
init();
