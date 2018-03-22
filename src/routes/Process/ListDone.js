import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Table, Divider, Badge, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;

const attachDocTypeMap = {
  project: '项目',
};

const statusMap = ['error', 'processing', 'success', 'default'];
const statusName = ['异常', '运行中', '已完成', '已取消'];

@connect(({ absProcess, loading }) => ({
  absProcess,
  loading: loading.models.absProcess,
}))
@Form.create()
export default class ListDone extends PureComponent {
  state = {
    keywords: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProcess/queryDoneList',
    });
  }

  columns = [
    {
      title: '文档名称',
      dataIndex: 'attachDocName',
    },
    {
      title: '文档类型',
      dataIndex: 'attachDocType',
      render(val) {
        return <span>{attachDocTypeMap[val]}</span>;
      },
    },
    {
      title: '流程名称',
      dataIndex: 'workflowName',
    },
    {
      title: '当前环节',
      dataIndex: 'currentNodeName',
    },
    {
      title: '状态',
      key: 'status',
      filters: [
        {
          text: statusName[0],
          value: 0,
        },
        {
          text: statusName[1],
          value: 1,
        },
        {
          text: statusName[2],
          value: 2,
        },
        {
          text: statusName[3],
          value: 3,
        },
      ],
      onFilter: (value, record) => {
        const status = this.transRecordStatus(record);
        return status === value;
      },
      render: (text, record) => {
        const status = this.transRecordStatus(record);
        return <Badge status={statusMap[status]} text={statusName[status]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime > b.createTime,
    },
    {
      title: '发起机构',
      dataIndex: 'creator',
    },
    {
      title: '详情',
      render: (text, record) => (
        <Fragment>
          <Link to={`/process/detail/${record.id}`}>
            查看流程
          </Link>
          <Divider type="vertical" />
          <Link to={`/${record.attachDocType}/detail/${record.attachDocId}`}>
            查看文档
          </Link>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定要取消这个流程吗？" onConfirm={() => this.cancelProcess(record)}>
            <a href="#">取消</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  transRecordStatus = (record) => {
    let status = 0;
    if (record.canceled) {
      status = 3;
    } else if (record.finished) {
      status = 2;
    } else if (!record.finished && !record.canceled) {
      status = 1;
    }
    return status;
  }

  cancelProcess = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProcess/cancelProcess',
      payload: { processId: record.id },
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
    const { absProcess: { data } } = this.props;
    const { keywords } = this.state;
    if (keywords.length === 0) {
      return data;
    }
    const filterDatas = data.filter((item) => {
      let includeKeys = true;
      keywords.forEach((keyword) => {
        includeKeys = includeKeys
          && item.attachDocName.toLowerCase().includes(keyword.toLowerCase());
      });
      return includeKeys;
    });
    return filterDatas;
  }

  render() {
    const { loading, form: { getFieldDecorator } } = this.props;
    const tableData = this.filterTableData();
    return (
      <PageHeaderLayout title="已办任务">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <Link to="/workflow/create/linear">
                      <Button icon="plus" type="primary">
                        发起流程
                      </Button>
                    </Link>
                  </Col>
                  <Col md={12} sm={24}>
                    <FormItem label="文档名称">
                      {getFieldDecorator('keywords')(
                        <Input placeholder="文档名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={24}>
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
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
