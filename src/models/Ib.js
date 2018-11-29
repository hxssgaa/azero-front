import { message } from 'antd';
import queryString from 'query-string';
import {
  queryIbSyncData,
  queryIbSyncProgressData,
  queryIbConfigSyncSymbols,
  queryIbSyncSymbols,
  queryIbStartData,
  queryIbStopData,
  queryIbCurrentTime,
} from '../services/ib';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  namespace: 'Ib',

  state: {
    loading: false,
    syncData: {},
    syncedSymbolsData: {},
    progressData: {},
    currentTime: '',
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const payloadTrue = Object.keys(payload).length >= 1 ? payload : '0';
      const response = yield call(queryIbSyncData, payloadTrue);
      yield put({ type: 'fetchSyncSymbol' });
      if (response && response.success) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: { syncData: data },
        });
      }
    },

    * fetchSyncSymbol(_, { call, put }) {
      const response = yield call(queryIbSyncSymbols);
      if (response && response.success) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: { syncedSymbolsData: data },
        });
      }
    },

    * fetchProgress({ payload }, { call, put }) {
      const response = yield call(queryIbSyncProgressData, payload);
      if (response && response.success) {
        const { data: { data } } = response;
        yield put({
          type: 'save',
          payload: { progressData: data },
        });
      }
      const { pathname } = location;
      // just send requests every second
      if (pathname.includes('ib')) {
        // according to the response to judge whether it can send the requests or not
        if (response && response.data && response.data.data) {
          // const { data: { data: { currentProgress } } } = response;
          // if (parseInt(currentProgress, 10) !== 1) {
          // yield delay(1000);
          // yield put({ type: 'fetchProgress' });
          // }
        }
      }
    },

    * fetchAdd({ payload }, { call, put }) {
      const { stocksSymbols } = payload;
      const response = yield call(queryIbConfigSyncSymbols, stocksSymbols);
      if (response && response.success) {
        yield put({ type: 'fetchSyncSymbol' });
      }
    },

    * fetchStart({ payload }, { call, put }) {
      const response = yield call(queryIbStartData, payload);
      if (response && response.success) {
        yield put({ type: 'fetch', payload });
        yield put({ type: 'fetchProgress' });
        const { data: { status } } = response;
        const statusDetail = parseInt(status, 10) === 0 ? '当前数据同步成功开启' : '当前数据同步已经开启，不需要再开启';
        message.success(statusDetail);
      } else {
        message.warning('请求失败,请联系系统管理员');
      }
    },

    * fetchStop({ payload }, { call, put }) {
      const response = yield call(queryIbStopData, payload);
      if (response && response.success) {
        yield put({ type: 'fetch', payload });
        const { data: { status } } = response;
        const statusDetail = parseInt(status, 10) === 0 ? '正在同步，已经关闭' : '已经关闭';
        message.success(statusDetail);
      } else {
        message.warning('请求失败,请联系系统管理员');
      }
    },

    * fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryIbCurrentTime, payload);
      if (response && response.success) {
        const { data: { time } } = response;
        yield put({
          type: 'save',
          payload: { currentTime: time },
        });
      } else {
        message.warning('请求失败,请联系系统管理员');
      }

      const { pathname } = location;
      if (pathname.includes('ib')) {
        // according to the response to judge whether it can send the requests or not
        if (response && response.data && response.data.time) {
          // const { data: { data: { currentProgress } } } = response;
          // if (parseInt(currentProgress, 10) !== 1) {
          yield delay(60000);
          yield put({ type: 'fetchCurrent' });
          // }
        }
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
        if (pathname.includes('/ib')) {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchProgress', payload: query });
          dispatch({ type: 'fetchCurrent' });
        }
      });
    },
  },
};
