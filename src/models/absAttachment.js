import { routerRedux } from 'dva/router';
import { attachmentUpload,queryAttachmentList,queryAttachmentListByIdList } from '../services/absAttachment';

export default {
  namespace: 'absAttachment',

  state: {
  },

  effects: {
    *attachmentUpload({ payload, callback }, { call, put }) {
      const response = yield call(attachmentUpload, payload);
      callback(response.attachmentId);
    },
    *queryAttachmentList(_, { call, put }) {
      const response = yield call(queryAttachmentList);
      yield put({
        type: 'showAttachmentList',
        payload: response,
      });
    },
    *queryAttachmentListByIdList(payload, { call, put }) {
      //console.log('yyyyyyyyyyyyy1:'+JSON.stringify(payload));
      //console.log('yyyyyyyyyyyyy2:'+JSON.stringify(payload.payload));
      const response = yield call(queryAttachmentListByIdList,payload);
      yield put({
        type: 'showAttachmentList',
        payload: response,
      });
    },
  },

  reducers: {
    showAttachmentList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },     
  },
};
