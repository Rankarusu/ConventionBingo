(function init() {
  const loadBtn = document.querySelector('[data-load-grid]');
  const exportBtn = document.querySelector('[data-export-grid]');
  const importBtn = document.querySelector('[data-import-grid]');
  const deleteBtn = document.querySelector('[data-delete-grid]');
  // eslint-disable-next-line no-undef
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  const gridTemplate = document.querySelector('[bingo-grid-template]');
  const fieldTemplate = document.querySelector('[bingo-field-template]');

  function loadSheetsFromLocalStorage() {
    const localStorageSheets = Object.keys(localStorage).filter((sheet) => sheet.includes('sheet'));

    localStorageSheets.forEach((sheet) => {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      slide.dataset.id = sheet;
      const content = JSON.parse(localStorage.getItem(sheet));
      const sheetNode = gridTemplate.content.cloneNode(true).children[0];

      content.forEach((field) => {
        const element = fieldTemplate.content.cloneNode(true).children[0];
        const displayText = element.querySelector('[data-bingo-field-text]');
        const checkbox = element.querySelector('[data-bingo-checkbox]');

        displayText.textContent = field.text;
        checkbox.checked = field.checked;
        sheetNode.append(element);
      });
      slide.appendChild(sheetNode);
      swiper.appendSlide(slide);
    });
  }

  function getActiveSlideId() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const sheetId = activeSlide.dataset.id;
    return sheetId;
  }

  function setCurrentSheet() {
    const sheetId = getActiveSlideId();
    const sheet = localStorage.getItem(sheetId);
    localStorage.setItem('currentSheet', sheet);
  }
  function deleteSheet() {
    const sheetId = getActiveSlideId();
    localStorage.removeItem(sheetId);
    swiper.removeSlide(swiper.activeIndex);
    swiper.update();
  }
  loadBtn.addEventListener('click', setCurrentSheet);
  deleteBtn.addEventListener('click', deleteSheet);

  loadSheetsFromLocalStorage();
}());
