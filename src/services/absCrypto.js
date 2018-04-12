import request from '../utils/request';

/**
 * RSA加密数据
 */
export async function rsaEncrypt(params) {
  return request('/api/v1/crpyto/rsa/encrypt', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * RSA解密数据
 * @param {string} stateID 加密数据存储的stateID
 */
export async function rsaDecrypt(stateID) {
  return request(`/api/v1/crpyto/rsa/decrypt?pid=${stateID}`);
}
