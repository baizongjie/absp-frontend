import request from '../utils/request';

/**
 * 上传附件
 */
export async function attachmentUpload(params) {
  return request('/api/v1/attachmentUpload', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询附件列表
 */
export async function queryAttachmentList() {
  return request('/api/v1/queryAttachmentList');
}

/**
 * 根据逐渐列表查询附件列表
 */
export async function queryAttachmentListByIdList(params) {
  //console.log('zzzzzzzzzz1:'+JSON.stringify(params));
  return request('/api/v1/queryAttachmentListByIdList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
