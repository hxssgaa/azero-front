import { message } from 'antd';
import queryString from 'query-string';
import { queryTdSyncData, queryTdSyncProgressData, queryTdStartData, queryTdStopData } from '../services/td';

export default {
  namespace: 'Td',

  state: {
    loading: false,
    syncData: {},
    progressData: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryTdSyncData);
      if (response && response.success) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: { syncData: data },
        });
      }
    },

    * fetchProgress(_, { call, put }) {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      const response = yield call(queryTdSyncProgressData);
      if (response && response.success) {
        const { data: { data } } = response;
        yield put({
          type: 'save',
          payload: { progressData: data },
        });
      }
      const { pathname } = location;
      // just send requests every second
      if (pathname.includes('td')) {
        // according to the response to judge whether it can send the requests or not
        if (response && response.data && response.data.data.isSyncing) {
          const { data: { data: { currentProgress } } } = response;
          if (parseInt(currentProgress, 10) !== 1) {
            yield delay(1000);
            yield put({ type: 'fetchProgress' });
          }
        }
      }
    },

    * fetchStart(_, { call, put }) {
      const response = yield call(queryTdStartData);
      if (response && response.success) {
        yield put({ type: 'fetch' });
        yield put({ type: 'fetchProgress' });
        const { data: { status } } = response;
        const statusDetail = parseInt(status, 10) === 0 ? '当前数据同步成功开启' : '当前数据同步已经开启，不需要再开启';
        message.success(statusDetail);
      } else {
        message.warning('请求失败,请联系系统管理员');
      }
    },

    * fetchStop(_, { call, put }) {
      const response = yield call(queryTdStopData);
      if (response && response.success) {
        yield put({ type: 'fetch' });
        const { data: { status } } = response;
        const statusDetail = parseInt(status, 10) === 0 ? '正在同步，已经关闭' : '已经关闭';
        message.success(statusDetail);
      } else {
        message.warning('请求失败,请联系系统管理员');
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
          dispatch({
            type: 'fetchProgress',
            payload: query,
          });
        }
      });
    },
  },
};
