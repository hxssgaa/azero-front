import { message } from 'antd';
import queryString from 'query-string';
import { queryTdSyncData, queryTdStartData, queryTdStopData } from '../services/api';

export default {
  namespace: 'Td',

  state: {
    loading: false,
    data: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryTdSyncData);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'save',
          payload: { data },
        });
      }
    },

    * fetchStart(_, { call, put }) {
      const response = yield call(queryTdStartData);
      if (response && response.success) {
        yield put({ type: 'fetch'});
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
        yield put({ type: 'fetch'});
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
        }
      });
    },
  },
};
