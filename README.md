# ReadVault

微信读书助手 - 一个现代化的微信读书数据管理和导出工具

## 功能特性

- 📚 **书架管理** - 查看和管理您的微信读书书架
- 🔍 **书籍搜索** - 快速搜索书籍
- 📝 **笔记管理** - 查看和导出您的阅读笔记
- 📊 **阅读统计** - 查看您的阅读数据统计
- 🎯 **发现推荐** - 发现更多好书推荐

## 技术栈

### 前端
- Vue 3 + Vite
- TypeScript
- Element Plus
- Vue Router

### 后端
- Node.js + Express
- TypeScript

## 快速开始

### 前置要求
- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
# 安装前端依赖
cd web
npm install

# 安装后端依赖
cd ../server
npm install
```

### 开发模式

```bash
# 启动前端开发服务器
cd web
npm run dev

# 启动后端开发服务器（新开终端）
cd server
npm run dev
```

### 构建生产版本

```bash
# 构建前端
cd web
npm run build

# 构建后端
cd server
npm run build
```

## 项目结构

```
ReadVault/
├── .agents/           # Trae AI Agent 配置
├── .trae/             # Trae 项目配置
├── server/            # 后端代码
│   ├── src/
│   │   ├── client/    # 微信读书 Skill 封装
│   │   ├── routes/    # API 路由
│   │   └── index.ts   # 服务器入口
│   └── package.json
├── web/               # 前端代码
│   ├── src/
│   │   ├── api/       # API 调用封装
│   │   ├── components/# 公共组件
│   │   ├── router/    # 路由配置
│   │   ├── utils/     # 工具函数
│   │   ├── views/     # 页面组件
│   │   └── main.ts    # 应用入口
│   └── package.json
└── README.md
```

## 安全说明

- 用户凭证仅存储在本地浏览器中，不上传服务器
- 所有操作均为只读操作，不修改用户数据
- 导出文件仅在浏览器生成，不经过服务器

## License

MIT
