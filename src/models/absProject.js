import { createAbsProject, queryAbsProjectList, removeAbsProject, queryAbsProjectDetail, modifyAbsProject } from '../services/absProject';

export default {
  namespace: 'absProject',

  state: {
  },

  effects: {
    *createAbsProject({ payload, callback }, { call }) {
      const response = yield call(createAbsProject, payload);
      callback(response.projectId);
    },
    *removeAbsProject({ payload }, { call, put }) {
      const { projectId } = payload;
      yield call(removeAbsProject, projectId);
      const response = yield call(queryAbsProjectList);
      yield put({
        type: 'showProjectList',
        payload: response,
      });
    },
    *modifyAbsProject({ payload, callback }, { call }) {
      yield call(modifyAbsProject, payload);
      callback();
    },
    *queryAbsProjectList(_, { call, put }) {
      const response = yield call(queryAbsProjectList);
      yield put({
        type: 'showProjectList',
        payload: response,
      });
    },
    *queryAbsProjectDetail({ payload }, { call, put }) {
      const { projectId } = payload;
      const response = yield call(queryAbsProjectDetail, projectId);
      yield put({
        type: 'showProjectDetail',
        payload: response,
      });
    },
  },

  reducers: {
    showProjectList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    showProjectDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
