import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
export default class Detail extends Component {
  componentDidMount() {
    // 获取url中的pid参数
    const { dispatch, match: { params: { pid } } } = this.props;
    console.log(pid);
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  render() {
    return (
      <PageHeaderLayout title="项目详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="项目名称">交诚2017年第一期不良资产支持证券</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="参与机构" style={{ marginBottom: 32 }}>
            <Description term="发起机构">交通银行</Description>
            <Description term="受托机构">交银国信</Description>
            <Description term="资金保管机构">兴业银行</Description>
            <Description term="登记/支付代理机构">中债登</Description>
            <Description term="资产服务机构">上海融孚律师事务所</Description>
            <Description term="评估机构">深圳市世联资产评估有限公司</Description>
            <Description term="信用评级机构">中债资信</Description>
            <Description term="流动性支持机构">中证信用增进股份有限公司</Description>
            <Description term="承销商/簿记管理人">招商证券</Description>
            <Description term="律师">北京市金杜律师事务所</Description>
            <Description term="会计师">普华永道</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="其他信息" style={{ marginBottom: 32 }}>
            <Description term="发行规模">10亿元</Description>
            <Description term="基础资产">小微企业、个人按揭贷款</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
