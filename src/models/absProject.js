import { routerRedux } from 'dva/router';
import { createAbsProject, queryAbsProjectList, removeAbsProject, queryAbsProjectDetail, modifyAbsProject } from '../services/absProject';

export default {
  namespace: 'absProject',

  state: {
  },

  effects: {
    *createAbsProject({ payload }, { call, put }) {
      const response = yield call(createAbsProject, payload);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put(routerRedux.push(`/project/success/${response.projectId}`));
      }
    },
    *removeAbsProject({ payload }, { call, put }) {
      const { projectId } = payload;
      yield call(removeAbsProject, projectId);
      const response = yield call(queryAbsProjectList);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put({
          type: 'showProjectList',
          payload: response,
        });
      }
    },
    *modifyAbsProject({ payload }, { call, put }) {
      const response = yield call(modifyAbsProject, payload);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put(routerRedux.push(`/project/success/${payload.projectId}`));
      }
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
