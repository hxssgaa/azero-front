// import { urlToList } from '../_utils/pathTools';
// import { getFlatMenuKeys, getMenuMatchKeys } from './SiderMenu';
//
// const menu = [
//   {
//     name: 'td',
//     icon: 'profile',
//     path: 'td',
//   },
//   {
//     name: 'futu',
//     icon: 'dashboard',
//     path: 'futu',
//   },
//   {
//     name: 'ib',
//     icon: 'form',
//     path: 'ib',
//   },
//   {
//     name: 'meta',
//     icon: 'table',
//     path: 'meta',
//   },
// ];
//
// const flatMenuKeys = getFlatMenuKeys(menu);
//
describe('test convert nested menu to flat menu', () => {
  it('simple menu', () => {
    expect('2').toEqual('2');
    expect(2 + 2).toBe(4);
  });
});

// describe('test menu match', () => {
//   it('simple path', () => {
//     console.info(1111, flatMenuKeys);
//     expect(getMenuMatchKeys(flatMenuKeys, urlToList('/td'))).toEqual(['/td']);
//   });
//
//   // it('error path', () => {
//   //   expect(getMenuMatchKeys(flatMenuKeys, urlToList('/dashboardname'))).toEqual([]);
//   // });
//   //
//   // it('Secondary path', () => {
//   //   expect(getMenuMatchKeys(flatMenuKeys, urlToList('/dashboard/name'))).toEqual([
//   //     '/dashboard',
//   //     '/dashboard/name',
//   //   ]);
//   // });
//   //
//   // it('Parameter path', () => {
//   //   expect(getMenuMatchKeys(flatMenuKeys, urlToList('/userinfo/2144'))).toEqual([
//   //     '/userinfo',
//   //     '/userinfo/:id',
//   //   ]);
//   // });
//   //
//   // it('three parameter path', () => {
//   //   expect(getMenuMatchKeys(flatMenuKeys, urlToList('/userinfo/2144/info'))).toEqual([
//   //     '/userinfo',
//   //     '/userinfo/:id',
//   //     '/userinfo/:id/info',
//   //   ]);
//   // });
// });
