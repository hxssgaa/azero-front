import queryString from 'query-string';
import { queryFutuData,queryFutuDataLaoXiang,aaa,abc } from '../services/api';

export default {
  namespace: 'Ib',

  state: {
    loading: false,
    futu: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      console.info(4444, 'kkkkk');
      const response = yield call(abc);
      console.info('laoxiang333', response);

      // const response = true;
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
      };
    },
  },

  // 监听事件
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname.includes('/ib')) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        }
      });
    },
  },
};
