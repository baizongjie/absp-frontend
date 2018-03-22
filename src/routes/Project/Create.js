import React, { PureComponent } from 'react';
import { Row, Col } from 'antd/lib/grid';
import { connect } from 'dva';

import {
  Form, Input, Button, Card, Icon, Upload, message, 
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import './style.less';
import AttachmentUpload from '../Attachment/AttachmentUpload';
import AttachmentDownload from '../Attachment/AttachmentDownload';

const FormItem = Form.Item;

@connect(({ absAttachment,loading }) => ({
  absAttachment,submitting: loading.effects['absProject/createAbsProject'],
}))
@Form.create()
export default class Create extends PureComponent {
  state = {
    attachmentIdList: [],
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.attachmentIdList=this.state.attachmentIdList;
        console.log(JSON.stringify(values));
        this.props.dispatch({
          type: 'absProject/createAbsProject',
          payload: values,
        });
      }
    });
  }
  onUploadChanged = (attachmentIdList) => {  
    this.setState({  
      attachmentIdList: attachmentIdList  
    });  
    console.log(attachmentIdList);
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 18 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const getTxtInpuHalfCol = (key, label, placeholder) => (
      <Col span={12}>
        <FormItem
          {...formItemLayout2}
          label={label}
        >
          {getFieldDecorator(key, {
            rules: [{
              required: true, message: `请输入${label}`,
            }],
          })(
            <Input placeholder={placeholder} />
          )}
        </FormItem>
      </Col>
    );

    return (
      <PageHeaderLayout title="ABS项目新增" content="在完成受托机构、券商、评级等中介机构选聘的前提下，为原始权益人提供项目基本信息新增、修改、删除以及查询功能，包括项目名称、参与机构、发行概况等">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="项目名称"
            >
              {getFieldDecorator('projectName', {
                rules: [{
                  required: true, message: '请输入项目名称',
                }],
              })(
                <Input placeholder="给目标起个名字" />
              )}
            </FormItem>
            <Row>
              {getTxtInpuHalfCol('initiator', '发起机构', '交通银行')}
              {getTxtInpuHalfCol('trustee', '受托机构', '交银国信')}
            </Row>
            <Row>
              {getTxtInpuHalfCol('depositary', '资金保管机构', '兴业银行')}
              {getTxtInpuHalfCol('agent', '登记/支付代理机构', '中债登')}
            </Row>
            <Row>
              {getTxtInpuHalfCol('assetService', '资产服务机构', '上海融孚律师事务所')}
              {getTxtInpuHalfCol('assessor', '评估机构', '深圳市世联资产评估有限公司')}
            </Row>
            <Row>
              {getTxtInpuHalfCol('creditRater', '信用评级机构', '中债资信')}
              {getTxtInpuHalfCol('liquiditySupporter', '流动性支持机构', '中证信用增进股份有限公司')}
            </Row>
            <Row>
              {getTxtInpuHalfCol('underwriter', '承销商/簿记管理人', '招商证券')}
              {getTxtInpuHalfCol('lawyer', '律师', '北京市金杜律师事务所')}
            </Row>
            <Row>
              {getTxtInpuHalfCol('accountant', '会计师', '普华永道')}
            </Row>
            <Row>
              {getTxtInpuHalfCol('scale', '发行规模', '100亿元')}
              {getTxtInpuHalfCol('basicAssets', '基础资产', '小微企业、个人按揭贷款')}
            </Row>
            <Row>
                <AttachmentUpload callbackParent={this.onUploadChanged}  />
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button size="large" type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
