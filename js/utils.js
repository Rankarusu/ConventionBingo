export function showMessage(text) {
  const body = document.querySelector('body');
  const template = document.createElement('template');
  const html = `<div class="message">
    <div class="message__textbox">
    <span class="message__text">
    ${text}
    </span>
    <span class="message__icon material-icons md-24" data-cancel>cancel</span>
    </div>
    <div class="message__meter">
    <span class="message__progress-bg"><span class="message__progress"></span></span>
    </div>
    </div>`;
  template.innerHTML = html.trim();

  const newNode = template.content.cloneNode(true).children[0];
  const cancelBtn = newNode.querySelector('[data-cancel]');
  cancelBtn.addEventListener('click', () => {
    newNode.remove();
  });

  console.log(newNode);
  body.appendChild(newNode);

  setTimeout(() => {
    newNode.remove();
  }, 3000);
}

export async function readData() {
  let fields = [];
  /// get fields
  const cardKeys = Object.keys(localStorage).filter((card) => card.includes('card'));
  if (cardKeys.length === 0) {
    // TODO: throw some error if under 24 fields.
    // make sure remaining data is cleaned and read from json.
    localStorage.clear();
    // we need await here to make sure we have all the data before returning it to the main page.
    fields = await fetch('./data/fields.json')
      .then((res) => res.json())
      .then((data) => {
        const result = [];
        data.fields.forEach((field, i) => {
          const cardId = `card${i}`;
          localStorage.setItem(cardId, field);
          result[cardId] = field;
        });
        localStorage.setItem('next', data.fields.length);
        return result;
      });
    console.log('read from json and wrote to localStorage');
  } else {
    cardKeys.forEach((key) => {
      fields[key] = localStorage.getItem(key);
    });
    console.log('read from storage');
  }
  return fields;
}
