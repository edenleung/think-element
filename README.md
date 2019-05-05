## ThinkPHP Element
[![Build Status](https://travis-ci.org/xiaodit/think-element.svg?branch=master)](https://travis-ci.org/xiaodit/think-element)

ThinkPHP 5.1 与 Vue Element Admin 基础权限系统  

后端: https://github.com/xiaodit/think-admin  

预览地址: https://ele.xiaodim.com

文档: https://panjiachen.github.io/vue-element-admin-site/zh  

### 账号
* 超级管理员 `admin, 1234` 
* 普通管理员 `test, 1234`

### 前端部署
#### 安装
```
npm install
```
#### 预览
```
npm run dev
```
#### 打包
```
npm run build:prod
```
#### 刷新404问题
```nginx
try_files $uri $uri/ /index.html last;
```
#### 后端API配置
[修改此处](https://github.com/xiaodit/think-element/blob/master/config/dev.env.js#L4)

### 权限
#### 按钮
```
v-action:xxx
```
