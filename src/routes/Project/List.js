import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Table, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;

@connect(({ absProject, loading }) => ({
  absProject,
  loading: loading.models.absProject,
}))
@Form.create()
export default class List extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProject/queryAbsProjectList',
    });
  }

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '发行机构',
      dataIndex: 'initiator',
    },
    {
      title: '受托机构',
      dataIndex: 'trustee',
    },
    {
      title: '承销商',
      dataIndex: 'underwriters',
    },
    {
      title: '发行规模',
      dataIndex: 'scale',
    },
    {
      title: '基础资产',
      dataIndex: 'basicAssets',
    },
    {
      title: '详情',
      render: (text, record) => (
        <Fragment>
          <Link to={`/project/detail/${record.id}`}>
            查看
          </Link>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定要删除这条项目信息么？" onConfirm={() => this.removeProject(record)} okText="确定删除" cancelText="取消">
            <a href="#">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Link to={`/project/modify/${record.id}`}>
            修改
          </Link>
        </Fragment>
      ),
    },
  ];

  removeProject = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProject/removeAbsProject',
      payload: { projectId: record.id },
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
  }
  render() {
    const { absProject: { data }, loading, form: { getFieldDecorator } } = this.props;
    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <Link to="/project/create">
                      <Button icon="plus" type="primary">
                        新建
                      </Button>
                    </Link>
                  </Col>
                  <Col md={12} sm={24}>
                    <FormItem label="项目名称">
                      {getFieldDecorator('no')(
                        <Input placeholder="输入项目名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
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
