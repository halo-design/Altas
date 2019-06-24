export const getEl = (id: string) => document.getElementById(id);

export const bindClick = (el: HTMLElement, fn: Function) => {
  el.addEventListener(
    'click',
    e => {
      fn();
      e.stopPropagation();
    },
    false
  );
};
