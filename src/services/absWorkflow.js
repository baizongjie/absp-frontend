import request from '../utils/request';

/**
 * 新增线性工作流
 */
export async function createLinearWorkflow(params) {
  return request('/api/v1/createLinearWorkflow', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询工作流明细
 * @param {string} workflowId 工作流ID
 */
export async function queryWorkflowDetail(workflowId) {
  return request(`/api/v1/queryWorkflowDetail?pid=${workflowId}`);
}

/**
 * 查询工作流清单
 */
export async function queryWorkflowList() {
  return request('/api/v1/queryWorkflowList');
}

/**
 * 查询可发起的工作流清单
 */
export async function queryAccessableWorkflows() {
  return request('/api/v1/queryAccessableWorkflows');
}

/**
 * 修改工作流定义
 */
export async function modifyWorkflow(params) {
  return request('/api/v1/modifyWorkflow', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 启用或禁用工作流
 */
export async function enableOrDisableWorkflow(params) {
  return request('/api/v1/enableOrDisableWorkflow', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
