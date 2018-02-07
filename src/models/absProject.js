import { message } from 'antd';
import { createAbsProject, queryAbsProjectList } from '../services/abs';

export default {
  namespace: 'absProject',

  state: {
  },

  effects: {
    *createAbsProject({ payload }, { call, put }) {
      const response = yield call(createAbsProject, payload);
      yield put({
        type: 'createAbsProjectSuccess',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *queryAbsProjectList(_, { call, put }) {
      const response = yield call(queryAbsProjectList);
      yield put({
        type: 'showProjectList',
        payload: response,
      });
    },
  },

  reducers: {
    createAbsProjectSuccess(state, action) {
      message.success('提交成功');
      return {
        ...state,
        notice: action.payload,
      };
    },
    showProjectList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
