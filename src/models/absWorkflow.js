import { routerRedux } from 'dva/router';
import { createLinearWorkflow, queryWorkflowDetail, queryWorkflowList, queryAccessableWorkflows, modifyWorkflow, enableOrDisableWorkflow } from '../services/absWorkflow';

export default {
  namespace: 'absWorkflow',

  state: {
  },

  effects: {
    *createLinearWorkflow({ payload }, { call, put }) {
      const response = yield call(createLinearWorkflow, payload);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put(routerRedux.push(`/workflow/linear/success/${response.workflowId}`));
      }
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
    *queryAccessableWorkflows(_, { call, put }) {
      const response = yield call(queryAccessableWorkflows);
      yield put({
        type: 'showWorkflowList',
        payload: response,
      });
    },
    *modifyWorkflow({ payload }, { call, put }) {
      const response = yield call(modifyWorkflow, payload);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put(routerRedux.push(`/workflow/linear/success/${payload.workflowId}`));
      }
    },
    *enableOrDisableWorkflow({ payload }, { call, put }) {
      yield call(enableOrDisableWorkflow, payload);
      const response = yield call(queryWorkflowList);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put({
          type: 'showWorkflowList',
          payload: response,
        });
      }
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
