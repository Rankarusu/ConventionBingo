function toggleSidebar() {
  setTimeout(() => {
    document.getElementById("nav").classList.toggle("show");
    document.getElementById("screen-dim").classList.toggle("show");
    document.getElementById("burger").classList.toggle("change");
  }, 150);
  //adjustable delay
}

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

fetch("./data/fields.json")
  .then(res => res.json())
  .then(data => {
    fields = data["fields"].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).map(field => {

      const card = fieldTemplate.content.cloneNode(true).children[0];
      const cardText = card.querySelector("[data-text]");
      const delbtn = card.querySelector("[data-delete]");
      const editbtn = card.querySelector("[data-edit]");

      cardText.textContent = field

      delbtn.addEventListener("click", () => {
        card.remove();
      });
      // editbtn.addEventListener("click", () => {

      // });

      cardsContainer.append(card)
      return {
        text: field, element: card
      }
    })
  })


