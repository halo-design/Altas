export const url: RegExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
export const urlTest = (lnk: string) => {
  console.log(url.test(lnk));
  return url.test(lnk);
};
