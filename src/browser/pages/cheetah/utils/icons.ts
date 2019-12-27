const dir = (name: string) =>
  `../public/images/menu-icons/ynet_${name}/ynet_${name}@3x.png`;

const defaultIcons = {
  add_black: dir('add_black'),
  back_black: dir('back_black'),
  back_white: dir('back_white'),
  circleadd_gray: dir('circleadd_gray'),
  close_black: dir('close_black'),
  close_white: dir('close_white'),
  customerservice_gray: dir('customerservice_gray'),
  customerservice_white: dir('customerservice_white'),
  delete_white: dir('delete_white'),
  edit_gray: dir('edit_gray'),
  edit_white: dir('edit_white'),
  edittext_black: dir('edittext_black'),
  edittext_white: dir('edittext_white'),
  filter_white: dir('filter_white'),
  location_gray: dir('location_gray'),
  logout: dir('logout'),
  message_black: dir('message_black'),
  message_white: dir('message_white'),
  messageactive_black: dir('messageactive_black'),
  messageactive_white: dir('messageactive_white'),
  more_black: dir('more_black'),
  more_white: dir('more_white'),
  scan_white: dir('scan_white'),
  search_bigwhite: dir('search_bigwhite'),
  search_gray: dir('search_gray'),
  search_white: dir('search_white'),
  setting_white: dir('setting_white'),
  shareleft_gray: dir('shareleft_gray'),
  shareup_white: dir('shareup_white'),
  voicesearch_gray: dir('voicesearch_gray'),
  voicesearch_white: dir('voicesearch_white'),
};

export default (icon: string) => {
  if (icon in defaultIcons) {
    return defaultIcons[icon];
  } else {
    return icon;
  }
};
