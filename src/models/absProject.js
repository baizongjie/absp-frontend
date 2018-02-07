import { message } from 'antd';
import { createAbsProject } from '../services/abs';

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
  },

  reducers: {
    createAbsProjectSuccess(state, action) {
      message.success('提交成功');
      return {
        ...state,
        notice: action.payload,
      };
    },
  },
};
