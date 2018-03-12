import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Steps, Divider, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './style.less';

const { Step } = Steps;
const { Description } = DescriptionList;

@connect(({ absWorkflow, loading }) => ({
  absWorkflow,
  loading: loading.models.absWorkflow,
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

  handleEnableStr = (workflowDef) => {
    if (workflowDef == null) {
      return '';
    }
    return workflowDef.enabled ? '可用' : '禁用';
  }

  handleNodeStep = (workflowNode) => {
    const { accessRoles, accessOrgs } = workflowNode;
    let roleTags = [];
    if (accessRoles != null && accessRoles.length !== 0) {
      roleTags = accessRoles.map(role =>
        <Tag key={role} color="green">{role}</Tag>
      );
    } else {
      roleTags.push(<Tag key="no-role">无</Tag>);
    }
    let orgTags = [];
    if (accessOrgs != null && accessOrgs.length !== 0) {
      orgTags = accessOrgs.map(org =>
        <Tag key={org} color="blue">{org}</Tag>
      );
    } else {
      orgTags.push(<Tag key="no-org">无</Tag>);
    }
    const description = (
      <div>
        <div>
          <span style={{ padding: '10px' }}>准入角色</span>
          {roleTags}
        </div>
        <div>
          <span style={{ padding: '10px' }}>准入机构</span>
          {orgTags}
        </div>
      </div>
    );
    return (
      <Step
        key={workflowNode.id}
        title={workflowNode.nodeName}
        description={description}
      />
    );
  }

  handleNodeSteps = (workflowNodes) => {
    const nodeSteps = [];
    workflowNodes.forEach((element) => {
      nodeSteps.push(this.handleNodeStep(element));
    });
    return nodeSteps;
  }

  render() {
    const { absWorkflow } = this.props;
    const { workflowDef = {}, workflowNodes = [] } = absWorkflow;
    const enabledStr = this.handleEnableStr(workflowDef);
    const nodeSteps = this.handleNodeSteps(workflowNodes);
    return (
      <PageHeaderLayout title="线性工作流详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="工作流基础信息" style={{ marginBottom: 32 }}>
            <Description term="工作流名称">{workflowDef.workflowName}</Description>
            <Description term="工作流类型">线性工作流</Description>
            <Description term="状态">{enabledStr}</Description>
            <Description term="创建人">{workflowDef.creator}</Description>
            <Description term="创建时间">{workflowDef.createTime}</Description>
            <Description term="最后修改人">{workflowDef.lastModifier}</Description>
            <Description term="最后修改时间">{workflowDef.modifyTime}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>节点清单</div>
          <Steps direction="vertical" current={-1}>
            <Step title="开始" />
            {nodeSteps}
            <Step title="结束" />
          </Steps>
        </Card>
      </PageHeaderLayout>
    );
  }
}
