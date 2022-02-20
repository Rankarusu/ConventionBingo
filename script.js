/******************************** NAV ********************************/

const nav = document.getElementById("nav");
const dimmer1 = document.getElementById("screen-dim1");
const burger = document.getElementById("burger");

function toggleSidebar() {
  setTimeout(() => {
    nav.classList.toggle("show");
    dimmer1.classList.toggle("show");
    burger.classList.toggle("change");
  }, 150);
  //adjustable delay
}



/******************************** MODAL ********************************/

const modal = document.querySelector("#edit-modal");
const dimmer2 = document.querySelector("#screen-dim2");
const modalText = modal.querySelector("[data-text-input]");
const savebtn = modal.querySelector("[data-save]");

function toggleModal() {
  dimmer2.classList.toggle("show");
  modal.classList.toggle("show");
}

function editCard(element, text) {

  modalText.value = text;
  toggleModal(); //show

  savebtn.onclick = () => {
    save(element, modalText.value);
    toggleModal(); //hide
  };
}

function save(element, text) {
  element.querySelector("[data-text]").textContent = text;
}



/******************************** SEARCHBAR ********************************/

const fieldTemplate = document.querySelector("[field-template]");
const cardsContainer = document.querySelector("[data-cards-container]");
const searchInput = document.querySelector("[data-search]");

let fields = []

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  console.log(fields);

  fields.forEach(field => {
    const isVisible = field.text.toLowerCase().includes(value);
    field.element.classList.toggle("hide", !isVisible);
  })
})



/******************************** CARD CREATION ********************************/
fetch("./data/fields.json")
  .then(res => res.json())
  .then(data => {
    fields = data["fields"].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).map(field => {

      const card = fieldTemplate.content.cloneNode(true).children[0];
      let cardText = card.querySelector("[data-text]");
      const delbtn = card.querySelector("[data-delete]");
      const editbtn = card.querySelector("[data-edit]");

      cardText.textContent = field

      delbtn.addEventListener("click", () => {
        card.remove();
      });

      editbtn.addEventListener("click", () => {
        editCard(card, cardText.textContent);
      });

      cardsContainer.append(card)
      return {
        text: field, element: card
      }
    });
  });


