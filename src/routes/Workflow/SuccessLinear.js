import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


function actions(pid) {
  return (
    <div>
      <Link to="/workflow/list" style={{ padding: '10px' }}>
        <Button type="primary">返回列表</Button>
      </Link>
      <Link to={`/workflow/linear/detail/${pid}`} style={{ padding: '10px' }}>
        <Button>查看项目</Button>
      </Link>
    </div>
  );
}

export default class SuccessLinear extends PureComponent {
  render() {
    const { match: { params: { pid } } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Result
            type="success"
            title="提交成功"
            actions={actions(pid)}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
