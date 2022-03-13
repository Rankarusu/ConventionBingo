(function init() {
  /** ****************************** NAV ******************************* */

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
