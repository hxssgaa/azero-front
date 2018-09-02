import queryString from 'query-string';
import { queryTdData } from '../services/api';

export default {
  namespace: 'Td',

  state: {
    loading: false,
    data: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryTdData);
      // console.info('tdResponse', response);

      // const response = true;
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
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
        if (pathname.includes('/td')) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        }
      });
    },
  },
};
