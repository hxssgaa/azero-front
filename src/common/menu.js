import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'futu',
    icon: 'dashboard',
    path: 'futu',
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
    name: 'td',
    icon: 'profile',
    path: 'td',
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
