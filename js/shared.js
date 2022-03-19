(function init() {
  // add Navbar to each page at the beginning of Body.
  const body = document.querySelector('body');
  const html = `<div id="screen-dim1" class="screen-dim"></div>
<div id="screen-dim2" class="screen-dim"></div>
<div class="header">
  <div id="burger">
    <div id="bar1" class="bar"></div>
    <div id="bar2" class="bar"></div>
    <div id="bar3" class="bar"></div>
  </div>
</div>
<div id="nav-container">
  <div id="nav">
    <ul>
      <li><a href="index.html">Play</a></li>
      <li><a href="edit.html">Edit</a></li>
      <li><a href="savedSheets.html">Saved Sheets</a></li>
    </ul>
  </div>
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
