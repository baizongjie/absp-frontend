import React, { PureComponent } from 'react';
import { Card, Button, Form, Col, Row, Input } from 'antd';
import { connect } from 'dva';
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
  submitting: loading.effects['absWorkflow/createLinearWorkflow'],
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

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const workflowNodes = [];
        values.nodes.forEach((element) => {
          const node = { nodeName: element.nodeName };
          node.accessRoles = element.accessRoles.split(',');
          node.accessOrgs = element.accessOrgs.split(',');
          workflowNodes.push(node);
        });
        this.props.dispatch({
          type: 'absWorkflow/createLinearWorkflow',
          payload: {
            workflowDef: {
              workflowName: values.workflowName,
            },
            nodeList: workflowNodes,
          },
        });
      }
    });
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
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
          <Button
            type="primary"
            htmlType="submit"
            onClick={this.handleSubmit}
            loading={submitting}
          >
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

