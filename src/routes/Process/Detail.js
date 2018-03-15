import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Steps, Cascader, Form, Modal, Popconfirm } from 'antd';
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

const operMap = {
  TransferProcess: '提交',
  InitProcess: '发起',
  ReturnProcess: '退回',
  WithdrawProcess: '撤回',
  CancelProcess: '取消',
};

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
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  render(val) {
    return <span>{operMap[val]}</span>;
  },
}, {
  title: '操作时间',
  dataIndex: 'createTime',
  key: 'createTime',
}];

@connect(({ absProcess, loading }) => ({
  absProcess,
  loading: loading.models.absProcess,
  submitting: loading.effects['absProcess/transferProcess'],
  returning: loading.effects['absProcess/returnProcess'],
  withdrawing: loading.effects['absProcess/withdrawProcess'],
}))
@Form.create()
export default class Detail extends Component {
  state = {
    modalVisible: false,
  }

  componentDidMount() {
    // 获取url中的pid参数
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absProcess/queryProcessAndWorkflowDetail',
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

  handlePageTitle = (detail) => {
    if (Object.keys(detail).length === 0) {
      return '';
    }
    const title = `${detail.workflowName} - ${detail.attachDocName}`;
    return title;
  }

  handleStatusStr = (detail) => {
    if (Object.keys(detail).length === 0) {
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

  handleSteps = (detail, logs, nodes) => {
    if (Object.keys(detail).length === 0
      || Object.keys(logs).length === 0
      || Object.keys(nodes).length === 0) {
      return [];
    }
    // 渲染进度图
    // 保持进度图内少于等于5个节点
    // 先根据操作日志渲染Steps
    const progressSteps = [];
    logs.forEach((element) => {
      if (element.operation === 'ReturnProcess'
        || element.operation === 'WithdrawProcess') {
        progressSteps.pop();
      } else {
        progressSteps.push(
          <Step
            key={element.fromNodeId}
            title={element.fromNodeName}
            description={element.fromOrg}
            status="finish"
          />
        );
      }
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

  handleNextOpts = (detail, nodes) => {
    if (Object.keys(detail).length === 0
      || Object.keys(nodes).length === 0) {
      return [];
    }
    // 先将所有节点映射一个map
    const nodeMap = {};
    nodes.forEach((element) => {
      nodeMap[element.id] = element;
    });
    // 找到当前节点
    const currentNode = nodeMap[detail.currentNodeId];
    if (currentNode == null) {
      return [];
    }
    // 组装options
    const options = [];
    if (currentNode.lastNode) {
      // 最后一个节点
      options.push({
        value: '',
        label: '结束',
        children: [{
          value: '',
          label: '结束',
        }],
      });
    } else {
      // 其他节点
      currentNode.nextNodeIds.forEach((element) => {
        const nextNode = nodeMap[element];
        // 目前只处理 accessOrgs
        const children = [];
        nextNode.accessOrgs.forEach((org) => {
          children.push(
            {
              value: org,
              label: org,
            }
          );
        });
        options.push(
          {
            value: nextNode.id,
            label: nextNode.nodeName,
            children,
          }
        );
      });
    }
    return options;
  }

  checkIsStartNode = (detail, nodes) => {
    if (Object.keys(detail).length === 0
      || Object.keys(nodes).length === 0) {
      return true;
    }
    const nodeMap = {};
    nodes.forEach((element) => {
      nodeMap[element.id] = element;
    });
    const currentNode = nodeMap[detail.currentNodeId];
    if (currentNode == null) {
      return true;
    }
    if (currentNode.firstNode) {
      return true;
    }
    return false;
  }

  checkOrgCanWithdraw = (detail, logs, userOrg) => {
    if (Object.keys(detail).length === 0
      || Object.keys(logs).length === 0) {
      return false;
    }
    const transLogs = [];
    logs.forEach((element) => {
      if (element.operation === 'TransferProcess'
        && element.toOrg === detail.currentOwner
        && element.toNodeId === detail.currentNodeId) {
        transLogs.push(element);
      }
    });

    if (transLogs.length === 0) {
      return false;
    }

    // find latest log
    let targetLog = transLogs[0];
    if (transLogs.length !== 1) {
      const idPrefix = `processLog-${detail.processId}-`;
      let targetId = parseInt(targetLog.id.replace(idPrefix, ''), 10);
      transLogs.forEach((element) => {
        const eleId = parseInt(element.id.replace(idPrefix, ''), 10);
        if (eleId > targetId) {
          targetLog = element;
          targetId = eleId;
        }
      });
    }

    // check user is last tranfer org
    if (targetLog.fromOrg !== userOrg) {
      return false;
    }

    return true;
  }

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleOk = () => {
    const { dispatch, match: { params: { pid } }, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { nextNodeAndOrg } = values;
        dispatch({
          type: 'absProcess/transferProcess',
          payload: {
            processId: pid,
            nextNodeId: nextNodeAndOrg[0],
            nextOwner: nextNodeAndOrg[1],
          },
        });
      }
    });
  }

  returnProcess = () => {
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absProcess/returnProcess',
      payload: {
        processId: pid,
      },
    });
  }

  withdrawProcess = () => {
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absProcess/withdrawProcess',
      payload: {
        processId: pid,
      },
    });
  }

  render() {
    const { modalVisible } = this.state;
    const { absProcess, form, location, submitting, returning, withdrawing } = this.props;
    const { getFieldDecorator } = form;
    const { pathname } = location;
    const { detail = {}, logs = [], workflowNodes = [], loading } = absProcess;
    const isTodo = pathname.indexOf('/process/todo/detail/') === 0;
    const isStartNode = this.checkIsStartNode(detail, workflowNodes);
    const disableReturnBtn = isTodo ? isStartNode : true;
    // TODO 检查登录用户机构是否为可回退机构
    const userOrg = '@org1.example.com';
    const disableWithdrawBtn = isTodo || isStartNode ? true
      : !this.checkOrgCanWithdraw(detail, logs, userOrg);
    const options = isTodo ? this.handleNextOpts(detail, workflowNodes) : [];
    const pageTitle = this.handlePageTitle(detail);
    const status = this.handleStatusStr(detail);
    const progressSteps = this.handleSteps(detail, logs, workflowNodes);

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

    const actionContent = (
      <Modal
        title="提交"
        visible={modalVisible}
        onOk={this.handleOk}
        confirmLoading={submitting}
        onCancel={this.handleCancel}
        maskClosable={false}
      >
        <Form
          label="选择下一环节与下一人"
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          <Form.Item>
            {getFieldDecorator('nextNodeAndOrg', {
              rules: [
                { required: true, message: '请选择下一个提交对象' },
              ],
            })(
              <Cascader
                size="large"
                expandTrigger="hover"
                placeholder="请选择下一个提交对象"
                options={options}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );

    const action = (
      <div>
        {actionContent}
        <Button.Group>
          <Popconfirm title="确定要退回流程吗？" onConfirm={() => this.returnProcess()}>
            <Button
              size="large"
              disabled={disableReturnBtn}
              loading={returning}
            >
              退回
            </Button>
          </Popconfirm>
          <Popconfirm title="确定要撤回流程吗？" onConfirm={() => this.withdrawProcess()}>
            <Button
              size="large"
              disabled={disableWithdrawBtn}
              loading={withdrawing}
            >
              撤回
            </Button>
          </Popconfirm>
          <Button
            size="large"
            type="primary"
            disabled={!isTodo}
            onClick={this.showModal}
          >
            提交
          </Button>
        </Button.Group>
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
