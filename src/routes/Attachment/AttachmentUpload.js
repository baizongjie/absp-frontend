import React, { PureComponent } from 'react';
import {
  Upload, message, Button, Icon,
} from 'antd';
import { connect } from 'dva';

@connect(({ absAttachment, loading }) => ({
  absAttachment,
  uploading: loading.effects['absAttachment/attachmentUpload'],
}))
export default class AttachmentUpload extends PureComponent {
  state = {
    fileList: [],
    attachmentIdList: [],
  }
  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = 'http://localhost:8080' + file.response.file_path;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState({ fileList: fileList });

    if (info.file.status === 'done') {
      message.success(`${info.file.name} attachment uploaded successfully`);

      this.props.dispatch({
        type: 'absAttachment/attachmentUpload',
        payload: {
          fileName: info.file.response.file_name,
          filePath: info.file.response.file_path,
          fileSha1: info.file.response.file_sha1,
        },
        // 增加一个回调，便于在请求完成后执行一些页面的控制逻辑
        callback: (attachmentId) => {
          let attachmentIdList = this.state.attachmentIdList;
          attachmentIdList.push(attachmentId);
          this.setState({ attachmentIdList: attachmentIdList });
          this.props.callbackParent(this.state.attachmentIdList);  
        },
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} attachment upload failed.`);
    }
  }
  render() {
    const props = {
      name: 'file',
      action: '/upload',
      onChange: this.handleChange,
      multiple: true,
    };
    const { uploading } = this.props;

    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button> 
          <Icon type="upload" loading={uploading} /> upload
        </Button>
      </Upload>
    );
  }
}
