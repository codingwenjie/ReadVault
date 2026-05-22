# ReadVault 项目规则（基于官方微信读书 Skill）

## 技术栈
前端：Vue3 + Vite + TypeScript + Element Plus
后端：Node.js + Express
数据：本地缓存，不上传用户隐私
UI：响应式 Web，支持 PC / 移动端

## 目录结构
/web/src          前端代码
/web/src/utils    工具函数
/web/src/api      API 调用封装
/web/src/views    页面组件
/web/src/components 公共组件
/server           后端 API 层
/server/src/client 微信读书 Skill 封装
/output           导出文件目录
.env              环境变量（不提交）

## 强制约束
1. 所有微信读书接口必须通过 Trae 官方 weread skill 调用
2. 不写任何自定义微信读书接口
3. 用户凭证仅存在本地，不上传服务器
4. 只做只读操作，不修改、不发表、不存储用户笔记
5. 导出文件仅在浏览器生成，不经过服务器
6. 严格按照 PRD 实现 MVP 功能

## AI 开发规则
1. 优先使用官方 weread skill 完成功能
2. 一次只做一个功能
3. 代码简洁、可运行、无错误