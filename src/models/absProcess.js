import { startProcess, queryProcessDetail, queryProcessLogs, transferProcess, cancelProcess, queryTodoList, queryDoneList } from '../services/absProcess';

export default {
  namespace: 'absProcess',

  state: {
  },

  effects: {
    *startProcess({ payload, callback }, { call }) {
      const response = yield call(startProcess, payload);
      callback(response.processId);
    },
    *cancelProcess({ payload }, { call, put }) {
      yield call(cancelProcess, payload);
      const response = yield call(queryTodoList);
      yield put({
        type: 'showTodoList',
        payload: response,
      });
    },
    *queryTodoList(_, { call, put }) {
      const response = yield call(queryTodoList);
      yield put({
        type: 'showTodoList',
        payload: response,
      });
    },
    *queryDoneList(_, { call, put }) {
      const response = yield call(queryDoneList);
      yield put({
        type: 'showDoneList',
        payload: response,
      });
    },
    *queryProcessDetail({ payload }, { call, put }) {
      const { processId } = payload;
      const response = yield call(queryProcessDetail, processId);
      yield put({
        type: 'showProcessDetail',
        payload: response,
      });
    },
    *queryProcessLogs({ payload }, { call, put }) {
      const { processId } = payload;
      const response = yield call(queryProcessLogs, processId);
      yield put({
        type: 'showProcessLogs',
        payload: response,
      });
    },
    *transferProcess({ payload }, { call, put }) {
      yield call(transferProcess, payload);
      const response = yield call(queryTodoList);
      yield put({
        type: 'showTodoList',
        payload: response,
      });
    },
  },

  reducers: {
    showProcessDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    showProcessLogs(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    showTodoList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    showDoneList(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
