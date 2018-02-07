import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Modal, Form, Input, Button, Table, message, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;
const columns = [
  {
    title: '项目名称',
    dataIndex: 'title',
  },
  {
    title: '发行机构',
    dataIndex: 'org1',
  },
  {
    title: '受托机构',
    dataIndex: 'org2',
  },
  {
    title: '承销商',
    dataIndex: 'org3',
  },
  {
    title: '发行规模',
    dataIndex: 'scope',
    render: value => `${value} 亿元`,
  },
  {
    title: '基础资产',
    dataIndex: 'assets',
  },
  {
    title: '详情',
    render: () => (
      <Fragment>
        <a href="">查看</a>
      </Fragment>
    ),
  },
  {
    title: '操作',
    render: () => (
      <Fragment>
        <a href="">删除</a>
        <Divider type="vertical" />
        <a href="">修改</a>
      </Fragment>
    ),
  },
];

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="描述"
      >
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ absProject, loading }) => ({
  absProject,
  loading: loading.models.absProject,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'absProject/queryAbsProjectList',
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const { absProject: { data }, loading, form: { getFieldDecorator } } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

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
              rowKey={record => record.key}
              columns={columns}
              dataSource={data}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
