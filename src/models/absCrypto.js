import { routerRedux } from 'dva/router';
import { rsaEncrypt, rsaDecrypt } from '../services/absCrypto';

export default {
  namespace: 'absProcess',

  state: {
  },

  effects: {
    *rsaEncrypt({ payload }, { call, put }) {
      const response = yield call(rsaEncrypt, payload);
      if ((Object.prototype.hasOwnProperty.call(response, 'success') && !response.success)
        || response.error != null) {
        yield put(routerRedux.push('/exception/500'));
      } else {
        yield put({
          type: 'showStateID',
          payload: response,
        });
      }
    },
    *rsaDecrypt({ payload }, { call, put }) {
      const { stateID } = payload;
      const response = yield call(rsaDecrypt, stateID);
      yield put({
        type: 'showDecryptData',
        payload: response,
      });
    },
  },

  reducers: {
    showStateID(state, action) {
      return {
        ...state,
        encryptStateID: action.payload,
      };
    },
    showDecryptData(state, action) {
      return {
        ...state,
        decryptData: action.payload,
      };
    },
  },
};
