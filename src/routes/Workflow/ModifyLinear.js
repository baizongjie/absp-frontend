import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Icon, Col, Row, Input, Popover, Divider, Table } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const fieldLabels = {
  workflowName: '工作流名称',
};

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
  render() {
    const { form, dispatch, submitting, absWorkflow, loading } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { workflowDef = {}, workflowNodes = [] } = absWorkflow;
    const {
      workflowName,
    } = workflowDef;
    const nodeList = [];
    workflowNodes.forEach((element) => {
      const node = element;
      node.accessRolesStr = node.accessRoles.join(',');
      node.accessOrgsStr = node.accessOrgs.join(',');
      nodeList.push(node);
    });
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        const workflowId = workflowDef.id;
        if (!error) {
          dispatch({
            type: 'absWorkflow/modifyWorkflow',
            payload: {
              ...values,
              workflowId,
            },
            // 增加一个回调，便于在请求完成后执行一些页面的控制逻辑
            callback: () => {
              dispatch(routerRedux.push(`/workflow/linear/success/${workflowId}`));
            },
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 },
      },
    };

    return (
      <PageHeaderLayout title="线性工作流详情">
        <Card bordered={false}>
          <Form layout="vertical" hideRequiredMark onSubmit={validate}>
            <Row gutter={16}>
              <Col>
                <Form.Item label={fieldLabels.workflowName}>
                  {getFieldDecorator('workflowName', {
                    rules: [{ required: true, message: '请输入工作流名称' }],
                    initialValue: workflowName,
                  })(
                    <Input placeholder="请输入工作流名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item {...submitFormLayout}>
              {getErrorInfo()}
              <Button size="large" type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </Form.Item>
          </Form>
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
