import { createLinearWorkflow, queryWorkflowDetail, queryWorkflowList, modifyWorkflow, enableOrDisableWorkflow } from '../services/absWorkflow';

export default {
  namespace: 'absWorkflow',

  state: {
  },

  effects: {
    *createLinearWorkflow({ payload, callback }, { call }) {
      const response = yield call(createLinearWorkflow, payload);
      callback(response.workflowId);
    },
    *queryWorkflowDetail({ payload }, { call, put }) {
      const { workflowId } = payload;
      const response = yield call(queryWorkflowDetail, workflowId);
      yield put({
        type: 'showWorkflowDetail',
        payload: response,
      });
    },
    *queryWorkflowList(_, { call, put }) {
      const response = yield call(queryWorkflowList);
      yield put({
        type: 'showWorkflowList',
        payload: response,
      });
    },
    *modifyWorkflow({ payload, callback }, { call }) {
      yield call(modifyWorkflow, payload);
      callback();
    },
    *enableOrDisableWorkflow({ payload }, { call, put }) {
      yield call(enableOrDisableWorkflow, payload);
      const response = yield call(queryWorkflowList);
      yield put({
        type: 'showWorkflowList',
        payload: response,
      });
    },
  },

  reducers: {
    showWorkflowDetail(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    showWorkflowList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
