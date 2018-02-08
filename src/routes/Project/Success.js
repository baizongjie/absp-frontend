import React from 'react';
import { Button, Card } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const actions = (
  <div>
    <Link to="/project/list" style={{ padding: '10px' }}>
      <Button type="primary">返回列表</Button>
    </Link>
    <Link to="/project/list" style={{ padding: '10px' }}>
      <Button>查看项目</Button>
    </Link>
  </div>
);

export default () => (
  <PageHeaderLayout>
    <Card bordered={false}>
      <Result
        type="success"
        title="提交成功"
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderLayout>
);
