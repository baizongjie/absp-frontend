import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


function actions(pid) {
  return (
    <div>
      <Link to={`/process/detail/${pid}`} style={{ padding: '10px' }}>
        <Button type="primary">查看详情</Button>
      </Link>
      <Link to="/process/todo/list">
        <Button>查看待办</Button>
      </Link>
      <Link to="/process/done/list">
        <Button>查看已办</Button>
      </Link>
    </div>
  );
}

export default class Success extends PureComponent {
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
