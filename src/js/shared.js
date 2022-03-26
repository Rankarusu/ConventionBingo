(async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js');
  }
  // add Navbar to each page at the beginning of Body.
  const body = document.querySelector('body');
  const html = `  
  <div id="screen-dim1" class="screen-dim"></div>
  <div id="screen-dim2" class="screen-dim"></div>
  <div class="header">
    <div id="burger" class="header__burger burger">
      <div id="bar1" class="burger__bar burger__bar--top"></div>
      <div id="bar2" class="burger__bar burger__bar--middle"></div>
      <div id="bar3" class="burger__bar burger__bar--bottom"></div>
    </div>
    <div class="header__title">${document.title}</div>
  </div>
  <div id="nav-container">
  <div id="nav" class="sidebar">
    <h2 class="sidebar__heading">ConventionBingo</h2>
    <ul class="sidebar__nav-list nav-list">
      <a href="index.html">
        <li class="nav-list__item">
          <span class="nav-list__icon material-icons md-48">play_arrow</span>
          <span>Play</span>
        </li>
      </a>
      <a href="edit.html">
        <li class="nav-list__item">
          <span class="nav-list__icon material-icons md-48">edit</span>
          <span>Edit</span>
        </li>
      </a>
      <a href="savedSheets.html">
        <li class="nav-list__item">
          <span class="nav-list__icon material-icons md-48">file_copy</span>
          <span>Saved Sheets</span>
        </li>
      </a>
      <a href="about.html">
      <li class="nav-list__item">
        <span class="nav-list__icon material-icons md-48">info</span>
        <span>About</span>
      </li>
    </a>
    </ul>
  </div>`;
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const newNode = template.content.cloneNode(true);
  body.prepend(newNode);

  const nav = document.getElementById('nav');
  const dimmer1 = document.getElementById('screen-dim1');
  const burger = document.getElementById('burger');

  function toggleSidebar() {
    setTimeout(() => {
      nav.classList.toggle('show');
      dimmer1.classList.toggle('show');
      burger.classList.toggle('change');
    }, 150);
    // adjustable delay
  }

  burger.onclick = toggleSidebar;
  dimmer1.onclick = toggleSidebar;
}());
