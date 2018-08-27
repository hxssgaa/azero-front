#! /bin/sh
# 构建代码,提交代码，发布代码
# 先构建
npm run build
git add -A
git commit -m "$1"
git push
