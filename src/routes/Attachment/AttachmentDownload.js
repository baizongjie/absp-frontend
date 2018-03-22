import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List } from 'antd';

import styles from './style.less';

@connect(({ absAttachment}) => ({
  absAttachment, 
}))
export default class AttachmentDownload extends PureComponent {
  componentWillReceiveProps() {
  //componentDidMount() {
    const { dispatch } = this.props;
    let attachmentIdList = this.props.attachmentIdList;
    //let attachmentIdList = ['123','234'];
    console.log('xxxxxxxxxxxx1:'+JSON.stringify(attachmentIdList));
    dispatch({
      type: 'absAttachment/queryAttachmentListByIdList',
      payload: JSON.stringify(attachmentIdList),
    });
  }

  render() {
    const { absAttachment: { data }} = this.props;
    return (
    <Card bordered={false} title="附件列表:">
      <div className={styles.tableList}>
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item >
              <List.Item.Meta
                title={<a href={"http://localhost:8080"+item.filePath}>{item.fileName}</a>}
              />
            </List.Item>
          )}
        />
      </div>
    </Card>
    );
  }
}
