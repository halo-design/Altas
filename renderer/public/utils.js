const getEl = id => document.getElementById(id);

const bindClick = (el, fn) => {
  el.addEventListener('click', e => {
    fn();
    e.stopPropagation();
  }, false);
}

module.exports = {
  getEl,
  bindClick,
}