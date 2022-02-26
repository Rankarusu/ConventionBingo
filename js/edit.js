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
        this.cardText = modalText.value;
        localStorage.setItem(this.id, this.text);
        toggleModal(); // hide
      };
    }

    delete() {
      this.element.remove();
      localStorage.removeItem(this.id);
    }
  }

  function createCard(field) {
    const card = fieldTemplate.content.cloneNode(true).children[0];
    const cardText = card.querySelector('[data-text]');
    let num = localStorage.getItem('next');
    if (!localStorage.next) {
      num = 0;
    }
    try {
      num = parseInt(num, 10);
    } catch (error) {
      num = 0;
    }

    const cardId = `card${num}`;
    cardText.innerText = field;
    card.dataset.id = cardId;

    const fieldObj = new Field(cardId, field, card);
    cardsContainer.append(card);

    localStorage.setItem('next', num + 1);
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
  // reading json data and creating fields
  // we should check how to put this in localstorage and then read it from there.

  localStorage.clear();

  fetch('./data/fields.json')
    .then((res) => res.json())
    .then((data) => {
      fields = data.fields.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).map((field) => createCard(field));
    });
  // check localstorage and load this instead maybe
  // Object.keys(localStorage).map((key) => createCard(localStorage[key])); // TODO: sort this.
}
init();
