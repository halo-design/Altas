export const url: RegExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
export const numAndLetter = /^[A-Za-z0-9]+$/;
export const urlTest = (lnk: string) => {
  return url.test(lnk);
};
