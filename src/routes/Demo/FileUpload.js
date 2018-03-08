import React, { PureComponent } from 'react';
import {
  Card, Upload, message, Button, Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class FileUpload extends PureComponent {
  render() {
    const props = {
      name: 'file',
      action: '/api/v1/upload',
      onChange(info) {
        // console.log(info);
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`
          ${info.file.name} file uploaded successfully
          url: ${info.file.response.fileUrl}
          `);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <PageHeaderLayout title="文件上传示例">
        <Card bordered={false}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" />
              Click to Upload
            </Button>
          </Upload>
        </Card>
      </PageHeaderLayout>
    );
  }
}
