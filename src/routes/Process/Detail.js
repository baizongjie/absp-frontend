import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button, Row, Col } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './Detail.less';

// const { Step } = Steps;
const { Description } = DescriptionList;

const attachDocTypeMap = {
  project: '项目',
};

const statusName = ['异常', '运行中', '已完成', '已取消'];

const logColumns = [{
  title: '节点',
  dataIndex: 'toNodeName',
  key: 'toNodeName',
}, {
  title: '机构',
  dataIndex: 'toOrg',
  key: 'toOrg',
}, {
  title: '操作时间',
  dataIndex: 'createTime',
  key: 'createTime',
}];

@connect(({ absProcess, loading }) => ({
  absProcess,
  loadingDetail: loading.effects['absProcess/queryProcessDetail'],
  loadingLogs: loading.effects['absProcess/queryProcessLogs'],
}))
export default class Detail extends Component {
  componentDidMount() {
    // 获取url中的pid参数
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absProcess/queryProcessDetail',
      payload: {
        processId: pid,
      },
    });
    dispatch({
      type: 'absProcess/queryProcessLogs',
      payload: {
        processId: pid,
      },
    });
  }

  render() {
    const { pathname } = this.props.location;
    const isTodo = pathname.indexOf('/process/todo/detail/') === 0;
    const { detail = {}, logs = [], loading } = this.props.absProcess;
    const pageTitle = `${detail.workflowName} - ${detail.attachDocName}`;
    let status = 0;
    if (detail.canceled) {
      status = 3;
    } else if (detail.finished) {
      status = 2;
    } else if (!detail.finished && !detail.canceled) {
      status = 1;
    }

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusName[status]}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>发起时间</div>
          <div className={styles.heading}>{detail.createTime}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="文档名称">{detail.attachDocName}</Description>
        <Description term="文档名称">
          <Link to={`/${detail.attachDocType}/detail/${detail.attachDocId}`}>
            {detail.attachDocName}
          </Link>
        </Description>
        <Description term="文档类型">{attachDocTypeMap[detail.attachDocType]}</Description>
        <Description term="流程名称">{detail.workflowName}</Description>
        <Description term="当前环节">{detail.currentNodeName}</Description>
        <Description term="当前处理人">{detail.CurrentOwner}</Description>
        <Description term="最后更新时间">{detail.modifyTime}</Description>
      </DescriptionList>
    );

    const action = (
      <div>
        <Button type="primary" disabled={!isTodo}>提交</Button>
      </div>
    );

    return (
      <PageHeaderLayout
        title={pageTitle}
        action={action}
        content={description}
        extraContent={extra}
      >
        <Card bordered={false} title="其他信息" style={{ marginBottom: 24 }}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="待添加">待添加</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
        <Card bordered={false} title="流程操作日志" style={{ marginBottom: 24 }}>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            rowKey={record => record.id}
            loading={loading}
            dataSource={logs}
            columns={logColumns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
