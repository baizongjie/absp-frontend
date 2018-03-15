import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Form, Input, Select, Button, Card, Table,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;

const docTypes = (
  <Option key="project" value="project">项目</Option>
);

@connect(({ absProcess, absWorkflow, loading }) => ({
  absProcess,
  absWorkflow,
  loading: loading.models.absProcess,
  submitting: loading.effects['absProcess/startProcess'],
}))
@Form.create()
export default class Start extends PureComponent {
  state = {
    width: '100%',
    selectedDocType: 'project',
    selectedDoc: {},
    docColumns: [],
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.queryAccessableWorkflows();
    this.handleDocTypeChange('project');
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

  actionColumn = {
    title: '操作',
    key: 'action',
    render: record => (
      <Button onClick={() => this.selectDoc(record)}>选择</Button>
    ),
  }

  handleWorkflowOpts = (workflowList) => {
    if (Object.keys(workflowList).length === 0) {
      return [];
    }
    const workflowOpts = workflowList.map(node =>
      <Option key={node.id} value={node.id}>{node.workflowName}</Option>
    );
    return workflowOpts;
  }

  handleDefaultWorkflowId = (workflowList) => {
    if (Object.keys(workflowList).length === 0) {
      return null;
    }
    return workflowList[0].id;
  }

  selectDoc = (record) => {
    const { setFieldsValue } = this.props.form;
    const docName = record[this.recordNameMap[record.docType]];
    setFieldsValue({
      attachDocName: docName,
    });
    this.setState({
      selectedDoc: record,
    });
  }

  handleDocTypeChange = (value) => {
    let columns = [];
    switch (value) {
      case 'project':
        columns = [
          {
            title: '文档名称',
            key: 'projectName',
            render: record => (
              <Fragment>
                <Link to={`/project/detail/${record.id}`} target="_blank">
                  {record.projectName}
                </Link>
              </Fragment>
            ),
          },
          {
            title: '发行机构',
            dataIndex: 'initiator',
            key: 'initiator',
          },
          {
            title: '发行规模',
            dataIndex: 'scale',
            key: 'scale',
          },
          {
            title: '基础资产',
            dataIndex: 'basicAssets',
            key: 'basicAssets',
          },
          this.actionColumn,
        ];
        break;
      default:
        break;
    }
    this.setState({
      selectedDocType: value,
      docColumns: columns,
    });
    this.queryDocList();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'absProcess/startProcess',
          payload: {
            workflowId: values.workflowId,
            attachDocType: this.state.selectedDocType,
            attachDocId: this.state.selectedDoc.id,
          },
        });
      }
    });
  }

  queryAccessableWorkflows = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absWorkflow/queryAccessableWorkflows',
    });
  }

  queryDocList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProcess/queryAbsDocList',
      payload: { docType: this.state.selectedDocType },
    });
  }

  recordNameMap = {
    project: 'projectName',
  };

  render() {
    const { submitting, absWorkflow, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { data = [] } = absWorkflow;
    const workflowOpts = this.handleWorkflowOpts(data);
    const defaultWorkflowId = this.handleDefaultWorkflowId(data);

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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <PageHeaderLayout
        title="发起新流程"
        content="请选择需要流转的文档和流程类型。"
        action={action}
      >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="选择工作流"
            >
              {getFieldDecorator('workflowId', {
                initialValue: defaultWorkflowId,
                rules: [
                  { required: true, message: '请选择一个流程工作流' },
                ],
              })(
                <Select>
                  {workflowOpts}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择文档"
            >
              <Input.Group compact>
                <Select
                  style={{ width: 120 }}
                  defaultValue={this.state.selectedDocType}
                  onChange={this.handleDocTypeChange}
                >
                  {docTypes}
                </Select>
                {getFieldDecorator('attachDocName', {
                  rules: [
                    { required: true, message: '请选择文档' },
                  ],
                })(
                  <Input
                    style={{ width: 'calc(100% - 120px)' }}
                    placeholder="文档标题会显示在这里"
                    disabled
                  />
                )}
              </Input.Group>
            </FormItem>
            <FormItem>
              <Table
                key="id"
                loading={loading}
                rowKey={record => record.id}
                columns={this.state.docColumns}
                dataSource={this.props.absProcess.docDatas}
              />
            </FormItem>

          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
