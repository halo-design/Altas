import { remote } from 'electron';
const { clipboard } = remote;

export const readText = (cb?: (args: string) => void): string => {
  const txt: string = clipboard.readText();
  cb && cb(txt);
  return txt;
};

export const readImage = (
  cb?: (args: Electron.nativeImage) => void
): Electron.nativeImage => {
  const ni = clipboard.readImage();
  cb && cb(ni);
  return ni;
};

export const writeText = (txt: string) => {
  clipboard.writeText(txt);
};
