import React, { PureComponent } from 'react';
import { Card, Button, Form, Col, Row, Input, Steps, Tag, Icon, Modal, List, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const { Step } = Steps;

const fieldLabels = {
  workflowName: '工作流名称',
};

@connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['absWorkflow/createLinearWorkflow'],
}))

@Form.create()
export default class CreateLinear extends PureComponent {
  state = {
    width: '100%',
    modalVisible: false,
    nodes: [
      {
        nodeName: '登记',
        accessRoles: [],
        accessOrgs: ['@org1.example.com', '@bankcomm.com'],
      },
    ],
    editIndex: -1,
    editNodeName: '',
    editAccessRoles: [],
    editAccessOrgs: [],
    newRoleInputVisible: false,
    newRoleInputValue: '',
    newOrgInputVisible: false,
    newOrgInputValue: '',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { nodes } = this.state;
        this.props.dispatch({
          type: 'absWorkflow/createLinearWorkflow',
          payload: {
            workflowDef: {
              workflowName: values.workflowName,
            },
            nodeList: nodes,
          },
        });
      }
    });
  }

  handleNodeStep = (workflowNode, index) => {
    const { accessRoles, accessOrgs } = workflowNode;
    let roleTags = [];
    if (accessRoles != null && accessRoles.length !== 0) {
      roleTags = accessRoles.map(role =>
        <Tag key={role} color="green">{role}</Tag>
      );
    } else {
      roleTags.push(<Tag key="no-role">无</Tag>);
    }
    let orgTags = [];
    if (accessOrgs != null && accessOrgs.length !== 0) {
      orgTags = accessOrgs.map(org =>
        <Tag key={org} color="blue">{org}</Tag>
      );
    } else {
      orgTags.push(<Tag key="no-org">无</Tag>);
    }

    const title = (
      <div>
        <a onClick={() => this.showModal(workflowNode, index)} style={{ marginRight: 8 }}>
          {workflowNode.nodeName}<Icon type="edit" />
        </a>
        <Button
          type="primary"
          style={{ margin: 4 }}
          shape="circle"
          icon="up"
          onClick={() => this.sortUp(index)}
          disabled={index === 0}
        />
        <Button
          type="primary"
          style={{ margin: 4 }}
          shape="circle"
          icon="down"
          onClick={() => this.sortDown(index)}
          disabled={index >= this.state.nodes.length - 1}
        />
      </div>
    );

    const description = (
      <div>
        <div>
          <span style={{ padding: '10px' }}>准入角色</span>
          {roleTags}
        </div>
        <div>
          <span style={{ padding: '10px' }}>准入机构</span>
          {orgTags}
        </div>
      </div>
    );
    return (
      <Step
        key={index}
        title={title}
        description={description}
      />
    );
  }

  handleNodeSteps = (workflowNodes) => {
    const nodeSteps = [];
    for (let index = 0; index < workflowNodes.length; index += 1) {
      const element = workflowNodes[index];
      nodeSteps.push(this.handleNodeStep(element, index));
    }
    return nodeSteps;
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }

  addNewNode = () => {
    this.setState({
      modalVisible: true,
      editIndex: this.state.nodes.length,
      editNodeName: '',
      editAccessRoles: [],
      editAccessOrgs: [],
    });
  }

  showModal = (node, index) => {
    this.setState({
      modalVisible: true,
      editIndex: index,
      editNodeName: node.nodeName,
      editAccessRoles: node.accessRoles,
      editAccessOrgs: node.accessOrgs,
    });
  }

  sortUp = (index) => {
    const { nodes } = this.state;
    const newNodes = [
      ...nodes.slice(0, index - 1),
      nodes[index],
      nodes[index - 1],
      ...nodes.slice(index + 1, nodes.length),
    ];
    this.setState({
      nodes: newNodes,
    });
  }

  sortDown = (index) => {
    const { nodes } = this.state;
    const newNodes = [
      ...nodes.slice(0, index),
      nodes[index + 1],
      nodes[index],
      ...nodes.slice(index + 2, nodes.length),
    ];
    this.setState({
      nodes: newNodes,
    });
  }

  updateNodeName = (event) => {
    this.setState({
      editNodeName: event.target.value,
    });
  }

  showRoleInput = () => {
    this.setState({ newRoleInputVisible: true }, () => this.roleInput.focus());
  }

  handleRoleInputChange = (e) => {
    this.setState({ newRoleInputValue: e.target.value });
  }

  handleRoleInputConfirm = () => {
    const { newRoleInputValue, editAccessRoles } = this.state;
    const newArr = [...editAccessRoles];
    if (newRoleInputValue && editAccessRoles.indexOf(newRoleInputValue) === -1) {
      newArr.push(newRoleInputValue);
    }
    this.setState({
      editAccessRoles: newArr,
      newRoleInputVisible: false,
      newRoleInputValue: '',
    });
  }

  showOrgInput = () => {
    this.setState({ newOrgInputVisible: true }, () => this.orgInput.focus());
  }

  handleOrgInputChange = (e) => {
    this.setState({ newOrgInputValue: e.target.value });
  }

  handleOrgInputConfirm = () => {
    const { newOrgInputValue, editAccessOrgs } = this.state;
    const newArr = [...editAccessOrgs];
    if (newOrgInputValue && editAccessOrgs.indexOf(newOrgInputValue) === -1) {
      newArr.push(newOrgInputValue);
    }
    this.setState({
      editAccessOrgs: newArr,
      newOrgInputVisible: false,
      newOrgInputValue: '',
    });
  }

  saveRoleInputRef = (input) => { this.roleInput = input; }
  saveOrgInputRef = (input) => { this.orgInput = input; }

  removeAccessRole = (value) => {
    const newDatas = this.state.editAccessRoles.filter(item => item !== value);
    this.setState({ editAccessRoles: newDatas });
  }

  removeAccessOrg = (value) => {
    const newDatas = this.state.editAccessOrgs.filter(item => item !== value);
    this.setState({ editAccessOrgs: newDatas });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleOk = () => {
    const { nodes, editIndex, editNodeName, editAccessRoles, editAccessOrgs } = this.state;
    const newNode = {
      nodeName: editNodeName,
      accessRoles: editAccessRoles,
      accessOrgs: editAccessOrgs,
    };

    if (editNodeName === '') {
      message.error('请输入节点名称', 5);
      return;
    }

    if ((editAccessRoles === null || editAccessRoles.length === 0)
      && (editAccessOrgs === null || editAccessOrgs.length === 0)) {
      message.error('请输入至少一个准入角色或准入机构', 5);
      return;
    }

    const newNodes = [
      ...nodes.slice(0, editIndex),
      newNode,
      ...nodes.slice(editIndex + 1, nodes.length),
    ];

    this.setState({
      modalVisible: false,
      nodes: newNodes,
      editIndex: -1,
      editNodeName: '',
      editAccessRoles: [],
      editAccessOrgs: [],
      newRoleInputVisible: false,
      newRoleInputValue: '',
      newOrgInputVisible: false,
      newOrgInputValue: '',
    });
  }

  render() {
    const {
      nodes,
      modalVisible,
      newOrgInputVisible,
      newRoleInputVisible,
      editAccessRoles,
      editAccessOrgs,
      newRoleInputValue,
      newOrgInputValue,
    } = this.state;
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const nodeSteps = this.handleNodeSteps(nodes);

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

    const addNode = (
      <div>
        <a onClick={() => this.addNewNode()}><Icon type="plus" />新增</a>
      </div>
    );

    return (
      <PageHeaderLayout
        title="创建线性工作流"
        wrapperClassName={styles.advancedForm}
        action={action}
      >
        <Card title="工作流信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col>
                <Form.Item label={fieldLabels.workflowName}>
                  {getFieldDecorator('workflowName', {
                    rules: [{ required: true, message: '请输入工作流名称' }],
                  })(
                    <Input placeholder="请输入工作流名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="节点管理" bordered={false}>
          <Steps direction="vertical" current={-1}>
            <Step title="开始" />
            {nodeSteps}
            <Step title={addNode} />
            <Step title="结束" />
          </Steps>
          <Modal
            title="编辑节点"
            visible={modalVisible}
            okText="保存"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
            <Row>
              <label htmlFor="editNodeNameInput">
                节点名称:
                <Input
                  id="editNodeNameInput"
                  ref={this.editNodeNameInputRef}
                  type="text"
                  value={this.state.editNodeName}
                  placeholder="请输入节点名称"
                  onChange={event => this.updateNodeName(event)}
                />
              </label>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Col span={12}>
                <div style={{ marginRight: 4 }}>
                  <div>准入角色:</div>
                  {newRoleInputVisible && (
                    <Input
                      ref={this.saveRoleInputRef}
                      type="text"
                      value={newRoleInputValue}
                      onChange={this.handleRoleInputChange}
                      onBlur={this.handleRoleInputConfirm}
                      onPressEnter={this.handleRoleInputConfirm}
                    />
                  )}
                  {!newRoleInputVisible && (
                    <Button
                      type="dashed"
                      style={{ width: '100%', marginBottom: 8 }}
                      icon="plus"
                      onClick={this.showRoleInput}
                    >
                      添加
                    </Button>
                  )}
                  <List
                    rowKey="key"
                    dataSource={editAccessRoles}
                    renderItem={item => (
                      <List.Item
                        actions={[<a onClick={() => this.removeAccessRole(item)}>删除</a>]}
                      >
                        <List.Item.Meta
                          title={item}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginLeft: 4 }}>
                  <div>准入机构:</div>
                  {newOrgInputVisible && (
                    <Input
                      ref={this.saveOrgInputRef}
                      type="text"
                      value={newOrgInputValue}
                      onChange={this.handleOrgInputChange}
                      onBlur={this.handleOrgInputConfirm}
                      onPressEnter={this.handleOrgInputConfirm}
                    />
                  )}
                  {!newOrgInputVisible && (
                    <Button
                      type="dashed"
                      style={{ width: '100%', marginBottom: 8 }}
                      icon="plus"
                      onClick={this.showOrgInput}
                    >
                      添加
                    </Button>
                  )}
                  <List
                    rowKey="key"
                    dataSource={editAccessOrgs}
                    renderItem={item => (
                      <List.Item
                        actions={[<a onClick={() => this.removeAccessOrg(item)}>删除</a>]}
                      >
                        <List.Item.Meta
                          title={item}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
            </Row>
          </Modal>
          );
        </Card>
      </PageHeaderLayout>
    );
  }
}

