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
  <Option value="project">项目</Option>
);

@connect(({ absProcess, loading }) => ({
  absProcess,
  loading: loading.models.absProcess,
  submitting: loading.effects['absProcess/startProcess'],
}))
@Form.create()
export default class Start extends PureComponent {
  state = {
    selectedDocType: 'project',
    selectedDoc: {},
    docColumns: this.projectCols,
  }

  componentDidMount() {
    this.queryAccessableWorkflows();
    this.queryProjects();
  }

  getWorkflowOpts = (workflowList) => {
    if (workflowList == null) {
      return [];
    }
    const workflowOpts = workflowList.map(node =>
      <Option key={node.id} value={node.id}>{node.workflowName}</Option>
    );
    return workflowOpts;
  }

  getDefaultWorkflowId = (workflowList) => {
    if (workflowList === null || workflowList.length === 0) {
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
        columns = this.projectColumns;
        break;
      default:
        break;
    }
    this.setState({
      selectedDocType: value,
      docColumns: columns,
    });
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
      type: 'absProcess/queryAccessableWorkflows',
    });
  }

  queryProjects = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProcess/queryAbsDocList',
      payload: { docType: this.state.selectedDocType },
    });
  }

  actionCol = {
    title: '操作',
    key: 'action',
    render: record => (
      <Button onClick={() => this.selectDoc(record)}>选择</Button>
    ),
  };

  projectCols = [
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
    this.actionCol,
  ];

  recordNameMap = {
    project: 'projectName',
  };

  render() {
    const { submitting, absProcess, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { workflowList = [] } = absProcess;
    const workflowOpts = this.getWorkflowOpts(workflowList);
    const defaultWorkflowId = this.getDefaultWorkflowId(workflowList);

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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 },
      },
    };

    return (
      <PageHeaderLayout title="发起新流程" content="请选择需要流转的文档和流程类型。">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                onClick={this.handleSubmit}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
