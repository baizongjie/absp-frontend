import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Popover } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import TableForm from './TableForm';
import styles from './style.less';

const fieldLabels = {
  workflowName: '工作流名称',
};

const tableData = [{
  key: '1',
  nodeName: '登记',
  accessRoles: '',
  accessOrgs: '@org1.example.com,@bankcomm.com',
}];

@connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['workflow/createLinearWorkflow'],
}))

@Form.create()
export default class CreateLinear extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          const workflowNodes = [];
          values.nodes.forEach((element) => {
            const node = { nodeName: element.nodeName };
            node.accessRoles = element.accessRoles.split(',');
            node.accessOrgs = element.accessOrgs.split(',');
            workflowNodes.push(node);
          });
          dispatch({
            type: 'absWorkflow/createLinearWorkflow',
            payload: {
              workflowDef: {
                workflowName: values.workflowName,
              },
              nodeList: workflowNodes,
            },
            // 增加一个回调，便于在请求完成后执行一些页面的控制逻辑
            callback: (workflowId) => {
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
    return (
      <PageHeaderLayout
        title="创建线性工作流"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="工作流信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col>
                <Form.Item label={fieldLabels.workflowName}>
                  {getFieldDecorator('workflowName', {
                    rules: [{ required: true, message: '请输入工作流名称' }],
                  })(
                    <Input placeholder="请输入工作流名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="节点管理" bordered={false}>
          {getFieldDecorator('nodes', {
            initialValue: tableData,
            rules: [{ required: true, message: '请添加节点' }],
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

