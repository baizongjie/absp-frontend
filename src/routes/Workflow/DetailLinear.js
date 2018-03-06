import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './style.less';

const { Description } = DescriptionList;

const nodeColumns = [{
  title: '节点ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '节点名称',
  dataIndex: 'nodeName',
  key: 'nodeName',
}, {
  title: '准入角色',
  dataIndex: 'accessRolesStr',
  key: 'accessRolesStr',
}, {
  title: '准入机构',
  dataIndex: 'accessOrgsStr',
  key: 'accessOrgsStr',
}];

@connect(({ absWorkflow, loading }) => ({
  absWorkflow,
  loading: loading.effects['absWorkflow/queryWorkflowDetail'],
}))
export default class DetailLinear extends Component {
  componentDidMount() {
    // 获取url中的pid参数
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absWorkflow/queryWorkflowDetail',
      payload: {
        workflowId: pid,
      },
    });
  }

  render() {
    const { absWorkflow, loading } = this.props;
    const { workflowDef = {}, workflowNodes = [] } = absWorkflow;
    const {
      workflowName,
      enabled,
      creator,
      createTime,
      lastModifier,
      modifyTime,
    } = workflowDef;
    const enabledStr = enabled ? '可用' : '禁用';
    const nodeList = [];
    workflowNodes.forEach((element) => {
      const node = element;
      node.accessRolesStr = node.accessRoles.join(',');
      node.accessOrgsStr = node.accessOrgs.join(',');
      nodeList.push(node);
    });
    return (
      <PageHeaderLayout title="线性工作流详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="工作流基础信息" style={{ marginBottom: 32 }}>
            <Description term="工作流名称">{workflowName}</Description>
            <Description term="工作流类型">线性工作流</Description>
            <Description term="状态">{enabledStr}</Description>
            <Description term="创建人">{creator}</Description>
            <Description term="创建时间">{createTime}</Description>
            <Description term="最后修改人">{lastModifier}</Description>
            <Description term="最后修改时间">{modifyTime}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>节点清单</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={nodeList}
            columns={nodeColumns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
