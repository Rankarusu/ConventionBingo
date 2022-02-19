function toggleSidebar() {
  setTimeout(() => {
    document.getElementById("nav").classList.toggle("show");
    document.getElementById("screen-dim1").classList.toggle("show");
    document.getElementById("burger").classList.toggle("change");
  }, 150);
  //adjustable delay
}

function toggleModal() {
  document.getElementById("screen-dim2").classList.toggle("show");
  document.getElementById("edit-modal").classList.toggle("show");
  //TODO: make only one dimmer and add logic so they dont overlap
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
    fields = data["fields"].map(field => {

      const card = fieldTemplate.content.cloneNode(true).children[0];
      let cardText = card.querySelector("[data-text]");
      const delbtn = card.querySelector("[data-delete]");
      const editbtn = card.querySelector("[data-edit]");
      const modal = document.querySelector("#edit-modal")
<<<<<<< HEAD

=======
      
>>>>>>> 23b49641e3c503b4fb3cc921250267e20a530493
      const cancelbtn = modal.querySelector("[data-cancel]");
      const savebtn = modal.querySelector("[data-save]");

      cardText.textContent = field

      delbtn.addEventListener("click", () => {
        card.remove();
      });
<<<<<<< HEAD

=======
      
>>>>>>> 23b49641e3c503b4fb3cc921250267e20a530493
      editbtn.addEventListener("click", () => {
        modal.querySelector("[data-text-input]").value = cardText.textContent;
        toggleModal();

        savebtn.addEventListener("click", () => {
          let input = modal.querySelector("[data-text-input]").value;
          cardText.textContent = input;
          document.getElementById("screen-dim2").classList.remove("show");
          document.getElementById("edit-modal").classList.remove("show");
        });
<<<<<<< HEAD

=======
        
>>>>>>> 23b49641e3c503b4fb3cc921250267e20a530493
        cancelbtn.addEventListener("click", () => {
          document.getElementById("screen-dim2").classList.remove("show");
          document.getElementById("edit-modal").classList.remove("show");
        });
<<<<<<< HEAD

=======
        
>>>>>>> 23b49641e3c503b4fb3cc921250267e20a530493
      });

      cardsContainer.append(card)
      return {
        text: field, element: card
      }
    });
  });


