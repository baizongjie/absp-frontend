import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


function actions(pid, workflowType) {
  return (
    <div>
      <Link to="/workflow/list" style={{ padding: '10px' }}>
        <Button type="primary">返回列表</Button>
      </Link>
      <Link to={`/workflow/${workflowType}/detail/${pid}`} style={{ padding: '10px' }}>
        <Button>查看流程</Button>
      </Link>
    </div>
  );
}

export default class SuccessLinear extends PureComponent {
  render() {
    const workflowType = 'linear';
    const { match: { params: { pid } } } = this.props;
    // const { pathname } = location;
    // if (pathname.indexOf('/workflow/linear/success/') === 0){
    //  workflowType = 'linear';
    // }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Result
            type="success"
            title="提交成功"
            actions={actions(pid, workflowType)}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
