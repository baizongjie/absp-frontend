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
 * 修改资产证券化项目信息
 */
export async function modifyAbsProject(params) {
  return request('/api/v1/modifyAbsProject', {
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

/**
 *  删除资产证券化项目
 * @param {string} projectId 项目ID
 */
export async function removeAbsProject(projectId) {
  return request('/api/v1/removeAbsProject', {
    method: 'POST',
    body: {
      projectId,
    },
  });
}

/**
 * 查询资产证券化项目明细
 * @param {string} projectId 项目ID
 */
export async function queryAbsProjectDetail(projectId) {
  return request(`/api/v1/queryAbsProjectDetail?pid=${projectId}`);
}
