function init() {
  const dimmer2 = document.getElementById('screen-dim2');
  /** ****************************** SEARCHBAR ******************************* */

  const fieldTemplate = document.querySelector('[field-template]');
  const searchInput = document.querySelector('[data-search]');

  let fields = [];

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    // console.log(fields);

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

  function toggleModal() {
    dimmer2.classList.toggle('show');
    modal.classList.toggle('show');
  }

  function save(element, text) {
    const card = element;
    card.querySelector('[data-text]').textContent = text;
  }

  function editCard(element, text) {
    modalHeader.innerText = 'Edit';
    modalText.value = text;
    toggleModal(); // show

    savebtn.onclick = () => {
      save(element, modalText.value);
      toggleModal(); // hide
    };
  }

  function createCard(field) {
    const card = fieldTemplate.content.cloneNode(true).children[0];
    const cardText = card.querySelector('[data-text]');
    const delbtn = card.querySelector('[data-delete]');
    const editbtn = card.querySelector('[data-edit]');

    cardText.textContent = field;

    delbtn.addEventListener('click', () => {
      card.remove();
    });

    editbtn.addEventListener('click', () => {
      editCard(card, cardText.textContent);
    });

    cardsContainer.append(card);
    return {
      text: field, element: card,
    };
  }

  function addNewCard() {
    modalHeader.innerText = 'Add new card';
    toggleModal(); // show

    savebtn.onclick = () => {
      createCard(modalText.value);
      toggleModal(); // hide
    };
    // we probably want to call the initial creation thing again to sort the cards.
  }

  addbtn.onclick = addNewCard;
  cancelbtn.onclick = toggleModal;

  /** ****************************** DATA ******************************* */
  // reading json data and creating fields
  // we should chekc how to put this in localstorage and then read it from there.
  fetch('./data/fields.json')
    .then((res) => res.json())
    .then((data) => {
      fields = data.fields.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).map((field) => createCard(field));
    });
}
init();
