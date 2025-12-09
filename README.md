# 道观黄页系统

一个全栈 Web 应用，用于展示和宣传中国各地的道观。

## 快速启动

### 1. 启动后端（终端 1）
```bash
cd backend
npm run dev
```
后端服务运行在 `http://localhost:3001`

### 2. 启动前端（终端 2）
```bash
cd frontend
npm install  # 首次需要
npm run dev
```
前端应用运行在 `http://localhost:3000`

## 项目结构

```
taoist-temple-directory/
├── backend/              # 后端 API 服务
│   ├── src/
│   │   ├── config/      # 配置
│   │   ├── middleware/  # 中间件
│   │   ├── routes/      # API 路由
│   │   └── index.js
│   ├── database/        # 数据库脚本
│   ├── scripts/         # 工具脚本
│   ├── .env             # 环境变量
│   └── package.json
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── services/    # API 服务
│   │   ├── i18n/        # 国际化
│   │   └── App.jsx
│   └── package.json
├── .kiro/specs/         # 项目规范
│   ├── requirements.md  # 需求文档
│   ├── design.md        # 设计文档
│   ├── tasks.md         # 实现计划
│   └── prototypes/      # HTML 原型
├── docs/                # 详细文档
├── QUICK_START.md       # 快速开始指南
├── IMPLEMENTATION_STATUS.md  # 实现状态
└── README.md
```

## 功能特性

- 道观信息展示和搜索
- 用户评价系统
- 道家典籍展示
- 知识库
- 后台管理系统
- 多语言支持（中英文）
- 响应式设计
- SEO 优化

## 技术栈

**后端：** Node.js + Express + MySQL + JWT  
**前端：** React 18 + React Router + i18next + Axios

## 数据库

- 数据库名：`daoguan`
- 主机：103.185.248.4
- 已创建 8 个数据表
- 初始管理员：admin / admin@taoist-temple.com

## 文档

- [快速开始](./QUICK_START.md)
- [实现状态](./IMPLEMENTATION_STATUS.md)
- [需求文档](./.kiro/specs/taoist-temple-directory/requirements.md)
- [设计文档](./.kiro/specs/taoist-temple-directory/design.md)
- [实现计划](./.kiro/specs/taoist-temple-directory/tasks.md)
- [详细文档](./docs/)

## 许可证

MIT
