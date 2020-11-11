export const getEl = (id: string) => document.getElementById(id);

export const bindClick = (el: HTMLElement | null, fn: () => void) => {
  if (!el) {
    return;
  }
  el.addEventListener(
    'click',
    (e) => {
      fn();
      e.stopPropagation();
    },
    false
  );
};
