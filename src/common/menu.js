import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'td',
    icon: 'profile',
    path: 'td',
  },
  {
    name: 'ib',
    icon: 'form',
    path: 'ib',
  },
  {
    name: 'meta',
    icon: 'table',
    path: 'meta',
  },
  {
    name: 'futu',
    icon: 'dashboard',
    path: 'futu',
  },
  {
    name: 'jiang',
    icon: 'dashboard',
    path: 'jiang',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
