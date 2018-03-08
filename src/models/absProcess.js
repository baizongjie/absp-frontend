import { startProcess, queryProcessDetail, queryProcessLogs, transferProcess, cancelProcess, queryTodoList, queryDoneList } from '../services/absProcess';
import { queryAbsProjectList } from '../services/absProject';
import { queryWorkflowDetail } from '../services/absWorkflow';

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
    *queryProcessDetailWithLogsAndWorkflow({ payload }, { call, put }) {
      const { processId } = payload;
      const detailResponse = yield call(queryProcessDetail, processId);
      const logsResponse = yield call(queryProcessLogs, processId);
      const { workflowId } = detailResponse;
      const workflowResponse = yield call(queryWorkflowDetail, workflowId);
      const rspPayload = {
        detail: detailResponse,
        logs: logsResponse,
        ...workflowResponse,
      };
      yield put({
        type: 'showProcessDetailWithLogAndWorkflow',
        payload: rspPayload,
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
    *queryAbsDocList({ payload }, { call, put }) {
      const { docType } = payload;
      let response = {};
      switch (docType) {
        case 'project':
          response = yield call(queryAbsProjectList);
          break;
        default:
          break;
      }
      yield put({
        type: 'showDocDataList',
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
        logs: action.payload,
      };
    },
    showProcessDetailWithLogAndWorkflow(state, action) {
      return {
        ...state,
        ...action.payload,
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
        data: action.payload,
      };
    },
    showDocDataList(state, action) {
      return {
        ...state,
        docDatas: action.payload,
      };
    },
  },
};
