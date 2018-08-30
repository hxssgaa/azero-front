import queryString from 'query-string';
import { queryFutuData } from '../services/api';

export default {
  namespace: 'Futu',

  state: {
    loading: false,
    futu: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      console.info(6666, 'kkkkk');
      const response = yield call(queryFutuData);
      console.info(111, response);

      // const response = true;
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
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
        if (pathname.includes('/futu')) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        }
      });
    },
  },
};
