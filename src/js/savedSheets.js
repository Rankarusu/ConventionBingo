/* eslint-disable import/extensions */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import { showMessage, bingoGridTemplate, bingoFieldTemplateDisabled } from './utils.js';

(function init() {
  const loadBtn = document.querySelector('[data-load-grid]');
  const exportBtn = document.querySelector('[data-export-grid]');
  const importBtn = document.querySelector('[data-import-grid]');
  const deleteBtn = document.querySelector('[data-delete-grid]');

  const fieldTemplate = document.createElement('template');
  fieldTemplate.innerHTML = bingoFieldTemplateDisabled.trim();

  const gridTemplate = document.createElement('template');
  gridTemplate.innerHTML = bingoGridTemplate.trim();

  // eslint-disable-next-line no-undef
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    spaceBetween: 20,

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

  function createSheetNode(content, id) {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.dataset.id = id;
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
    swiper.update();
  }

  function loadSheetsFromLocalStorage() {
    const localStorageSheets = Object.keys(localStorage).filter((sheet) => sheet.includes('sheet'));
    localStorageSheets.forEach((sheet) => {
      const content = JSON.parse(localStorage.getItem(sheet));
      createSheetNode(content, sheet);
    });
  }

  function getActiveSlideId() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const sheetId = activeSlide.dataset.id;
    return sheetId;
  }

  function setCurrentSheet() {
    let sheetId;
    try {
      sheetId = getActiveSlideId();
      if (confirm('This will overwrite your current sheet you are playing on.\n Are you sure?') === true) {
        const sheet = localStorage.getItem(sheetId);
        localStorage.setItem('currentSheet', sheet);
        showMessage('sheet loaded successfully!');
      }
    } catch (e) {
      alert('no sheet to load!');
    }
  }

  function deleteSheet() {
    let sheetId;
    try {
      sheetId = getActiveSlideId();
      if (confirm('Are you sure you want to delete this sheet?') === true) {
        localStorage.removeItem(sheetId);
        swiper.removeSlide(swiper.activeIndex);
        swiper.update();
        showMessage('sheet deleted successfully');
      }
    } catch (e) {
      alert('no sheets to delete!');
    }
  }

  // holy shit downloading stuff is hacky...
  function exportSheet() {
    let sheetId;
    try {
      sheetId = getActiveSlideId();

      const content = JSON.parse(localStorage.getItem(sheetId));
      const jsonString = JSON.stringify(content);
      const blobConfig = new Blob(
        [jsonString],
        { type: 'application/json' },
      );

      // Convert Blob to URL
      const blobUrl = URL.createObjectURL(blobConfig);

      // Create an a element with blobl URL
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.target = '_blank';
      anchor.download = 'bingo-sheet.json';

      // Auto click on a element, trigger the file download
      anchor.click();

      // Don't forget ;)
      URL.revokeObjectURL(blobUrl);
      // showMessage('sheet exported successfully!');
    } catch (e) {
      alert('no sheet to export!');
    }
  }
  function onReaderLoad(event) {
    const regexp = /^\[(({"id":\d+,"text":"(.*?)","checked":(true|false)},){24}({"id":\d+,"text":"(.*?)","checked":(true|false)}))\]$/;
    // TODO: put the code below in a function
    // validate json via regex
    if (regexp.test(event.target.result)) {
      const result = JSON.parse(event.target.result);
      let id = 'sheet0';

      const localStorageSheets = Object.keys(localStorage).filter((sheet) => sheet.includes('sheet'));
      // get highest ID
      if (localStorageSheets.length > 0) {
        // extract highest number from sheets in localstorage
        const indices = localStorageSheets.map((sheet) => parseInt(sheet.replace(/^\D+/g, ''), 10));
        id = `sheet${Math.max(...indices) + 1}`;
      }
      createSheetNode(result, id);
      localStorage.setItem(id, JSON.stringify(result));
      showMessage('sheet loaded successfully!');
    } else {
      alert('Invalid JSON');
    }
  }

  function onChange(event) {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  loadBtn.addEventListener('click', setCurrentSheet);
  deleteBtn.addEventListener('click', deleteSheet);
  exportBtn.addEventListener('click', exportSheet);
  importBtn.addEventListener('change', onChange);

  loadSheetsFromLocalStorage();
}());
