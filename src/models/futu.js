import { fakeChartData } from '../services/api';

export default {
  namespace: 'futu',

  state: {
    loading: false,
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
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
};
