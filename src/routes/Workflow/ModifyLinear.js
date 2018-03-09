import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Col, Row, Input, Divider, Steps, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const { Step } = Steps;

const fieldLabels = {
  workflowName: '工作流名称',
};

@connect(({ absWorkflow, loading }) => ({
  absWorkflow,
  loading: loading.models.absWorkflow,
  submitting: loading.effects['absWorkflow/modifyWorkflow'],
}))

@Form.create()
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

  getNodeStep = (workflowNode) => {
    const { accessRoles, accessOrgs } = workflowNode;
    let roleTags = [];
    if (accessRoles != null) {
      roleTags = accessRoles.map(role =>
        <Tag key={role} color="green">{role}</Tag>
      );
    } else {
      roleTags.push(<Tag key="no-role">无</Tag>);
    }
    let orgTags = [];
    if (orgTags != null) {
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

  getNodeSteps = (workflowNodes) => {
    const nodeSteps = [];
    workflowNodes.forEach((element) => {
      nodeSteps.push(this.getNodeStep(element));
    });
    return nodeSteps;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, match: { params: { pid } } } = this.props;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        dispatch({
          type: 'absWorkflow/modifyWorkflow',
          payload: {
            ...values,
            workflowId: pid,
          },
        });
      }
    });
  }

  render() {
    const { form, submitting, absWorkflow } = this.props;
    const { getFieldDecorator } = form;
    const { workflowDef = {}, workflowNodes = [] } = absWorkflow;
    const nodeSteps = this.getNodeSteps(workflowNodes);

    const action = (
      <div>
        <Button
          size="large"
          type="primary"
          onClick={this.handleSubmit}
          loading={submitting}
        >
          提交
        </Button>
      </div>
    );

    return (
      <PageHeaderLayout
        title="修改线性工作流信息"
        action={action}
      >
        <Card bordered={false}>
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label={fieldLabels.workflowName}>
                  {getFieldDecorator('workflowName', {
                    rules: [{ required: true, message: '请输入工作流名称' }],
                    initialValue: workflowDef.workflowName,
                  })(
                    <Input placeholder="请输入工作流名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
