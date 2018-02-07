import request from '../utils/request';

/**
 * 新增资产证券化项目
 */
export async function createAbsProject(params) {
  return request('/api/v1/createAbsProject', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询资产证券化项目
 */
export async function queryAbsProjectList() {
  return request('/api/v1/queryAbsProjectList');
}
