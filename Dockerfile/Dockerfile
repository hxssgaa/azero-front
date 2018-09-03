## 指定这个镜像的基础是什么，我们选择了node: 8.11.3这个版本作为基础镜像
FROM node:8.11.3
MAINTAINER lgcf1314 <lgcf1314@gmail.com>
##安装node相关依赖
RUN \
npm install yarn -g \
yarn add nrm && \
nrm use taobao &&\
yarn  add ant-design-pro-cli &&\
yarn  add cross-env
## 安装nginx
## 安装数据库...
## 创建一个目录
RUN mkdir /data
## 指定命令运行的目录
WORKDIR /data

ENTRYPOINT ["make", "dev"]
