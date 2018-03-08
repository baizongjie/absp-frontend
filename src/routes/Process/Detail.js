import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Steps } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './Detail.less';

const { Step } = Steps;
const { Description } = DescriptionList;

const attachDocTypeMap = {
  project: '项目',
};

const statusName = ['异常', '运行中', '已完成', '已取消'];

const showSteps = 5;

const getWindowWidth = () => (window.innerWidth || document.documentElement.clientWidth);

const logColumns = [{
  title: '提交节点',
  dataIndex: 'fromNodeName',
  key: 'fromNodeName',
}, {
  title: '提交机构',
  dataIndex: 'fromOrg',
  key: 'fromOrg',
}, {
  title: '接收节点',
  dataIndex: 'toNodeName',
  key: 'toNodeName',
}, {
  title: '接收机构',
  dataIndex: 'toOrg',
  key: 'toOrg',
}, {
  title: '操作时间',
  dataIndex: 'createTime',
  key: 'createTime',
}];

@connect(({ absProcess, loading }) => ({
  absProcess,
  loading: loading.models.absProcess,
}))
export default class Detail extends Component {
  componentDidMount() {
    // 获取url中的pid参数
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absProcess/queryProcessDetailWithLogsAndWorkflow',
      payload: {
        processId: pid,
      },
    });
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  getPageTitle = (detail) => {
    if (detail == null) {
      return '';
    }
    const title = `${detail.workflowName} - ${detail.attachDocName}`;
    return title;
  }

  getStatusStr = (detail) => {
    if (detail == null) {
      return 0;
    }
    let status = 0;
    if (detail.canceled) {
      status = 3;
    } else if (detail.finished) {
      status = 2;
    } else if (!detail.finished && !detail.canceled) {
      status = 1;
    }
    return status;
  }

  getSteps = (detail, logs, nodes) => {
    if (logs === null || nodes === null
      || logs.length === 0 || nodes.lenght === 0) {
      return null;
    }
    // 渲染进度图
    // 保持进度图内少于等于5个节点
    const progressSteps = [];
    // 先根据操作日志渲染Steps
    logs.forEach((element) => {
      progressSteps.push(
        <Step key={element.fromNodeId} title={element.fromNodeName} description={element.fromOrg} status="finish" />
      );
    });
    let currentStep = progressSteps.length - 1;
    // 添加当前节点Step
    if (!detail.canceled) {
      const lastLog = logs[logs.length - 1];
      const lastNodeStatus = detail.finished ? 'finish' : 'process';
      progressSteps.push(
        <Step
          key={lastLog.toNodeId}
          title={lastLog.toNodeName}
          description={lastLog.toOrg}
          status={lastNodeStatus}
        />
      );
      currentStep = progressSteps.length;
    }
    // 添加后续节点
    if (!detail.finished) {
      // 先将所有节点映射一个map
      const nodeMap = {};
      nodes.forEach((element) => {
        nodeMap[element.id] = element;
      });
      let preNodeId = detail.currentNodeId;
      let preNode = nodeMap[preNodeId];
      while (!preNode.lastNode) {
        const nextNodeId = preNode.nextNodeIds[0];
        const nextNode = nodeMap[nextNodeId];
        progressSteps.push(
          <Step key={nextNodeId} title={nextNode.nodeName} />
        );
        preNodeId = nextNodeId;
        preNode = nodeMap[preNodeId];
      }
      progressSteps.push(
        <Step key="finish_node" title="结束" />
      );
    }
    // 保留5个以内的节点
    if (progressSteps.length <= showSteps) {
      return progressSteps;
    }
    const keepSteps = parseInt(showSteps / 2, 10);
    if (currentStep < keepSteps + 1) {
      return progressSteps.slice(0, showSteps);
    } else if (currentStep < (progressSteps.length - keepSteps)) {
      return progressSteps.slice(currentStep - keepSteps, currentStep + keepSteps + 1);
    }
    return progressSteps.slice(progressSteps.length - showSteps);
  }

  render() {
    const { pathname } = this.props.location;
    const isTodo = pathname.indexOf('/process/todo/detail/') === 0;
    const { detail = {}, logs = [], workflowNodes = [], loading } = this.props.absProcess;
    const pageTitle = this.getPageTitle(detail);
    const status = this.getStatusStr(detail);
    const progressSteps = this.getSteps(detail, logs, workflowNodes);
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
          <Link to={`/${detail.attachDocType}/detail/${detail.attachDocId}`} target="_blank">
            {detail.attachDocName}
          </Link>
        </Description>
        <Description term="文档类型">{attachDocTypeMap[detail.attachDocType]}</Description>
        <Description term="流程名称">{detail.workflowName}</Description>
        <Description term="当前环节">{detail.currentNodeName}</Description>
        <Description term="当前处理人">{detail.currentOwner}</Description>
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
        <Card title="流程进度" bordered={false} style={{ marginBottom: 24 }} >
          <Steps direction="horizontal">
            {progressSteps}
          </Steps>
        </Card>
        <Card bordered={false} title="其他信息" style={{ marginBottom: 24 }}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="待添加">待添加</Description>
          </DescriptionList>
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
