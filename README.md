# ABS平台

本平台基于antd pro框架开发

## 使用

```bash
$ npm install
$ npm start         # 访问 http://localhost:8000
```
## 编译

```bash
$ npm install
$ npm run build
```

## 文档主要目录结构和文件说明

- `./roadhogrc.mock.js` 用于配置前后台ajax请求mock或代理
- `./src/common/router.js` 用于配置url路由关系,绑定页面组件
- `./src/common/menu.js` 用于配置菜单
- `./src/routes/` 该文件夹放置具体的模块页面，每个模块有独立文件夹，开发前建议学习React相关知识，组件选用antd组件库
- `./src/model/` 该文件夹放置模块对应的store和reducer信息，具体使用前建议学习Redux相关知识
- `./src/services/` 该文件夹放置前后台ajax请求逻辑

## 参考资料

antd pro相关资料可从如下地址获取

- 预览：http://preview.pro.ant.design
- 首页：http://pro.ant.design/index-cn
- 更新日志: http://pro.ant.design/docs/changelog-cn
- 常见问题：http://pro.ant.design/docs/faq-cn

antd 组件库资料可以查阅以下地址

- 首页: https://ant.design/index-cn

## 兼容性

现代浏览器及 IE11。
