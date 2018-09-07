## 指定这个镜像的基础是什么，我们选择了node: 8.11.3这个版本作为基础镜像
FROM node:8.11.3
MAINTAINER lgcf1314 <lgcf1314@gmail.com>
##安装node相关依赖
RUN apt-get update
RUN apt-get install sudo
RUN sudo apt remove cmdtest
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list 
RUN apt-get install apt-transport-https 
RUN sudo apt update
RUN sudo apt-get install yarn
RUN sudo npm install yarn -g
RUN sudo yarn global add nrm
RUN sudo nrm use taobao
RUN sudo yarn global add ant-design-pro-cli
RUN sudo yarn global add cross-env
RUN npm i roadhog -g 
## 创建一个目录
RUN mkdir /data
## 指定命令运行的目录
WORKDIR /data
