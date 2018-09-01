import queryString from 'query-string';
import { queryTdData } from '../services/api';

export default {
  namespace: 'Td',

  state: {
    loading: false,
    tdFormStore: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      console.info(1111, 'tdtdtd');
      const response = yield call(queryTdData);
      console.info('tdResponse', response);

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
