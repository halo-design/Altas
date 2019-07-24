const trans = (hex: string) => new Number('0x' + hex).toString(10);

export default (color: string): string => {
  if (typeof color !== 'string') {
    return '';
  }
  const argb = color.split('');
  const a = argb.slice(1, 3).join('');
  const r = argb.slice(3, 5).join('');
  const g = argb.slice(5, 7).join('');
  const b = argb.slice(7).join('');

  const rgba = `rgba(${trans(r)},${trans(g)},${trans(b)},${trans(a)})`;
  console.log(rgba);
  return rgba;
};
