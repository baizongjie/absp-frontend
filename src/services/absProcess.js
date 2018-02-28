import request from '../utils/request';

/**
 * 启动流程实例
 */
export async function startProcess(params) {
  return request('/api/v1/startProcess', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询流程实例明细
 * @param {string} processId 项目ID
 */
export async function queryProcessDetail(processId) {
  return request(`/api/v1/queryProcessDetail?pid=${processId}`);
}

/**
 * 查询流程日志
 * @param {string} processId 项目ID
 */
export async function queryProcessLogs(processId) {
  return request(`/api/v1/queryProcessLogs?pid=${processId}`);
}

/**
 * 流程实例流转
 */
export async function transferProcess(params) {
  return request('/api/v1/transferProcess', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 取消流程实例
 */
export async function cancelProcess(params) {
  return request('/api/v1/cancelProcess', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询待办
 */
export async function queryTodoList() {
  return request('/api/v1/queryTodoList');
}

/**
 * 查询已办
 */
export async function queryDoneList() {
  return request('/api/v1/queryDoneList');
}
