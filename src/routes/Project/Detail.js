import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import AttachmentDownload from '../Attachment/AttachmentDownload';

const { Description } = DescriptionList;

@connect(({ absAttachment,absProject, loading }) => ({
  absAttachment,
  absProject,
  loading: loading.effects['absProject/queryAbsProjectDetail'],
}))
export default class Detail extends Component {
  componentDidMount() {
    // 获取url中的pid参数
    const { dispatch, match: { params: { pid } } } = this.props;
    dispatch({
      type: 'absProject/queryAbsProjectDetail',
      payload: {
        projectId: pid,
      },
    });
  }

  render() {
    const { detail = {} } = this.props.absProject;
    const {
      projectName,
      initiator,
      trustee,
      depositary,
      agent,
      assetService,
      assessor,
      creditRater,
      liquiditySupporter,
      underwriter,
      lawyer,
      accountant,
      scale,
      basicAssets,
      attachmentIdList,
    } = detail;

    return (
      <PageHeaderLayout title="项目详情">
        <Card bordered={false}>
          <DescriptionList
            col="2"
            size="large"
            title="基本信息"
            style={{ marginBottom: 32 }}
          >
            <Description term="项目名称">{projectName}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList
            size="large"
            title="参与机构"
            style={{ marginBottom: 32 }}
          >
            <Description term="发起机构">{initiator}</Description>
            <Description term="受托机构">{trustee}</Description>
            <Description term="资金保管机构">{depositary}</Description>
            <Description term="登记/支付代理机构">{agent}</Description>
            <Description term="资产服务机构">{assetService}</Description>
            <Description term="评估机构">{assessor}</Description>
            <Description term="信用评级机构">{creditRater}</Description>
            <Description term="流动性支持机构">
              {liquiditySupporter}
            </Description>
            <Description term="承销商/簿记管理人">{underwriter}</Description>
            <Description term="律师">{lawyer}</Description>
            <Description term="会计师">{accountant}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList
            size="large"
            title="其他信息"
            style={{ marginBottom: 32 }}
          >
            <Description term="发行规模">{scale}</Description>
            <Description term="基础资产">{basicAssets}</Description>
          </DescriptionList>

          <AttachmentDownload  attachmentIdList = {attachmentIdList}/>
        </Card>
      </PageHeaderLayout>
    );
  }
}
