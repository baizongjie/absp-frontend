import React, { PureComponent, Fragment, span } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Table, Divider, Popconfirm, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;

const subDocTypeMap = {
  linear: '线性工作流',
};

@connect(({ absWorkflow, loading }) => ({
  absWorkflow,
  loading: loading.models.absWorkflow,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    keywords: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'absWorkflow/queryWorkflowList',
    });
  }

  columns = [
    {
      title: '工作流名称',
      dataIndex: 'workflowName',
    },
    {
      title: '子类型',
      dataIndex: 'subDocType',
      render(val) {
        return <span>{subDocTypeMap[val]}</span>;
      },
    },
    {
      title: '是否可用',
      dataIndex: 'enabled',
      key: 'enabled',
      filters: [
        {
          text: '可用',
          value: true,
        },
        {
          text: '禁用',
          value: false,
        },
      ],
      onFilter: (value, record) => {
        const boolValue = value === 'true';
        return record.enabled === boolValue;
      },
      render(val) {
        const statusName = val ? '可用' : '禁用';
        const statusId = val ? 'success' : 'error';
        return <Badge status={statusId} text={statusName} />;
      },
    },
    {
      title: '详情',
      render: (text, record) => (
        <Fragment>
          <Link to={`/workflow/${record.subDocType}/detail/${record.id}`}>
            查看
          </Link>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定要执行禁用/启用操作吗？" onConfirm={() => this.enableOrDisableWorkflow(record)} okText="确定" cancelText="取消">
            <a href="#">禁用/启用</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Link to={`/workflow/${record.subDocType}/modify/${record.id}`}>
            修改
          </Link>
        </Fragment>
      ),
    },
  ];

  enableOrDisableWorkflow = (record) => {
    this.handleFormReset();
    const { dispatch } = this.props;
    dispatch({
      type: 'absWorkflow/enableOrDisableWorkflow',
      payload: {
        workflowId: record.id,
        enabled: !record.enabled,
      },
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    this.setState({
      keywords: [],
    });
    form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { form: { getFieldValue } } = this.props;
    const keywordsStr = getFieldValue('keywords') || '';
    const keywords = keywordsStr.split(' ').filter((item) => {
      return item !== '';
    });
    this.setState({
      keywords,
    });
  }

  filterTableData = () => {
    const { absWorkflow: { data } } = this.props;
    const { keywords } = this.state;
    if (keywords.length === 0) {
      return data;
    }
    const filterDatas = data.filter((item) => {
      let includeKeys = true;
      keywords.forEach((keyword) => {
        includeKeys = includeKeys
          && item.workflowName.toLowerCase().includes(keyword.toLowerCase());
      });
      return includeKeys;
    });

    return filterDatas;
  }

  render() {
    const { loading, form: { getFieldDecorator } } = this.props;
    const tableData = this.filterTableData();
    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={6} sm={24}>
                    <Link to="/workflow/linear/create">
                      <Button icon="plus" type="primary">
                        新建线性工作流
                      </Button>
                    </Link>
                  </Col>
                  <Col md={12} sm={24}>
                    <FormItem label="工作流名称">
                      {getFieldDecorator('keywords')(
                        <Input placeholder="输入工作流名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={24}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </span>
                  </Col>
                </Row>
              </Form>

            </div>
            <Table
              loading={loading}
              rowKey={record => record.id}
              columns={this.columns}
              dataSource={tableData}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
