/* eslint-disable no-console */
function init() {
  const dimmer2 = document.getElementById('screen-dim2');

  /** ****************************** SEARCHBAR ******************************* */

  const fieldTemplate = document.querySelector('[field-template]');
  const searchInput = document.querySelector('[data-search]');

  let fields = [];

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();

    fields.forEach((field) => {
      const isVisible = field.text.toLowerCase().includes(value);
      field.element.classList.toggle('hide', !isVisible);
    });
  });

  /** ****************************** MODAL & CARDS ******************************* */

  const cardsContainer = document.querySelector('[data-cards-container]');
  const modal = document.querySelector('#edit-modal');
  const addbtn = document.querySelector('[data-add]');
  const cancelbtn = document.querySelector('[data-cancel]');

  const modalHeader = modal.querySelector('[data-modal-header]');
  const modalText = modal.querySelector('[data-text-input]');
  const savebtn = modal.querySelector('[data-save]');

  function toggleModal(head = '', text = '') {
    modalHeader.innerText = head;
    modalText.value = text;
    dimmer2.classList.toggle('show');
    modal.classList.toggle('show');
  }
  class Field {
    constructor(id, text, element) {
      this.id = id;
      this.text = text;
      this.element = element;
      this.cardText = this.element.querySelector('[data-text]');
      this.savebtn = document.querySelector('[data-save]');
      this.editbtn = this.element.querySelector('[data-edit]');
      this.delbtn = this.element.querySelector('[data-delete]');

      localStorage.setItem(this.id, this.text);
      this.editbtn.onclick = () => { this.edit(); };
      this.delbtn.onclick = () => { this.delete(); };
    }

    edit() {
      toggleModal('Edit', this.text); // show
      this.savebtn.onclick = () => {
        this.text = modalText.value;
        this.cardText.innerText = modalText.value;
        localStorage.setItem(this.id, this.text);
        toggleModal(); // hide
      };
    }

    delete() {
      this.element.remove();
      localStorage.removeItem(this.id);
    }
  }

  /**
   * if id is provided, this funciton will reassign it to the corresponding card.
   * if omitted, a new i will be generated.
   */
  function createCard(field, id = null) {
    const card = fieldTemplate.content.cloneNode(true).children[0];
    const cardText = card.querySelector('[data-text]');
    let cardId;
    let num = localStorage.getItem('next');
    if (!localStorage.next) {
      num = 0;
    } else {
      num = parseInt(num, 10);
    }

    if (id != null) {
      cardId = id;
    } else {
      cardId = `card${num}`;
    }

    cardText.innerText = field;
    card.dataset.id = cardId;

    const fieldObj = new Field(cardId, field, card);
    cardsContainer.append(card);
    if (id === null) {
      localStorage.setItem('next', num + 1);
    }
    return fieldObj;
  }

  function addNewCard() {
    toggleModal('Add new card', ''); // show

    savebtn.onclick = () => {
      createCard(modalText.value);
      toggleModal(); // hide
    };
  }

  addbtn.onclick = addNewCard;
  cancelbtn.onclick = toggleModal;
  dimmer2.onclick = toggleModal;

  /** ****************************** DATA ******************************* */
  // reading data from localStorage or JSON

  // localStorage.clear();

  // read data from localstorage if available
  const localStorageFields = Object.keys(localStorage).filter((card) => card.includes('card'));

  if (localStorageFields.length > 0) {
    fields = localStorageFields.map((key) => createCard(localStorage[key], key)); // TODO: sort this
    console.log('read from storage');
  } else {
    // make sure remaining data is cleaned and read from json.
    localStorage.clear();

    fetch('./data/fields.json')
      .then((res) => res.json())
      .then((data) => {
        fields = data.fields.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).map((field) => createCard(field));
      });
    console.log('read from json');
  }
}
// TODO: add a reset button somewhere
init();
