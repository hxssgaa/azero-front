import queryString from 'query-string';
// import { fakeChartData } from '../services/api';

export default {
  namespace: 'Futu',

  state: {
    loading: false,
    futu: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      console.info(4444,'kkkkk');
      // const response = yield call(fakeChartData);
      const response = true;
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
