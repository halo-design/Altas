export const url: RegExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
export const urlTest = (lnk: string) => {
  return url.test(lnk);
};
