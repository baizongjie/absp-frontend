import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;

const attachDocTypeMap = {
  project: '项目',
};

@connect(({ absProcess, loading }) => ({
  absProcess,
  loading: loading.models.absProcess,
}))
@Form.create()
export default class ListTodo extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProcess/queryTodoList',
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
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '到达时间',
      dataIndex: 'modifyTime',
    },
    {
      title: '详情',
      render: (text, record) => (
        <Fragment>
          <Link to={`/process/todo/detail/${record.id}`}>
            查看流程
          </Link>
          <Divider type="vertical" />
          <Link to={`/process/todo/detail/${record.id}`}>
            查看文档
          </Link>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Link to={`/workflow/${record.subDocType}/modify/${record.id}`}>
            提交
          </Link>
        </Fragment>
      ),
    },
  ];

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
  }
  render() {
    const { absProcess: { data }, loading, form: { getFieldDecorator } } = this.props;
    return (
      <PageHeaderLayout title="查询表格">
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
                      {getFieldDecorator('no')(
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
              dataSource={data}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
