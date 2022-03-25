/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { showMessage, readDataFromLS, readDataFromJSON, editCardTemplate } from './utils.js';

(async function init() {
  const dimmer2 = document.getElementById('screen-dim2');
  const template = document.createElement('template');
  const numberDisplay = document.querySelector('[data-card-amount');
  template.innerHTML = editCardTemplate.trim();

  /** ****************************** SEARCHBAR ******************************* */

  // const fieldTemplate = document.querySelector('[field-template]');
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
  const resetbtn = document.querySelector('[data-reset]');

  const modalHeader = modal.querySelector('[data-modal-header]');
  const modalText = modal.querySelector('[data-text-input]');
  const savebtn = modal.querySelector('[data-save]');

  function toggleModal(head = '', text = '') {
    modalHeader.innerText = head;
    modalText.value = text;
    modalText.innerText = text;
    dimmer2.classList.toggle('show');
    modal.classList.toggle('show');
    window.setTimeout(() => modalText.focus(), 100);
  }

  function updateAmount() {
    const amount = Object.keys(localStorage).filter((card) => card.includes('card')).length;
    numberDisplay.innerText = `${amount} entries`;
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
      showMessage('card deleted.');
      updateAmount();
    }
  }

  /**
   * if id is provided, this funciton will reassign it to the corresponding card.
   * if omitted, a new id will be generated.
   */
  function createCard(field, id = null) {
    const card = template.content.cloneNode(true).children[0];
    const cardText = card.querySelector('[data-text]');

    cardText.innerText = field;
    card.dataset.id = id;

    const fieldObj = new Field(id, field, card);
    cardsContainer.prepend(card);

    let num = localStorage.getItem('next');
    if (!localStorage.next) {
      num = 0;
    } else {
      num = parseInt(num, 10);
    }
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
      showMessage('new card added.');
      updateAmount();
    };
  }
  function resetFields() {
    if (confirm('This will reset all fields and reload the page.\nAre you sure?')) {
      readDataFromJSON();
      location.reload();
    }
  }

  addbtn.onclick = addNewCard;
  cancelbtn.onclick = toggleModal;
  dimmer2.onclick = toggleModal;
  resetbtn.onclick = resetFields;

  /** ****************************** DATA ******************************* */
  const cardKeys = Object.keys(localStorage).filter((card) => card.includes('card'));
  const lsFields = await readDataFromLS(cardKeys);
  // use the keys because we nee both key and value, sort them alphabetically and
  // create cards from them.

  fields = Object.keys(lsFields)
    .sort((b, a) => lsFields[a].localeCompare(lsFields[b], 'en', { sensitivity: 'base' }))
    .map((key) => createCard(lsFields[key], key));
  // TODO: add a reset button somewhere
  updateAmount();
}());
