const dir = (file: string) => `public/icons/${file}.svg`;
const defaultIcons = {
  back: dir('back'),
  close: dir('close'),
  msg: dir('msg'),
  scan: dir('scan'),
  user: dir('user'),
};

export default (icon: string) => {
  if (icon in defaultIcons) {
    return defaultIcons[icon];
  } else {
    return icon;
  }
};
