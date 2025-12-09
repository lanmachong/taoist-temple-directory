# 快速开始

## 启动应用

### 后端（终端 1）
```bash
cd backend
npm run dev
```
运行在 `http://localhost:3001`

### 前端（终端 2）
```bash
cd frontend
npm install  # 首次需要
npm run dev
```
运行在 `http://localhost:3000`

## 常用命令

### 后端
```bash
cd backend
npm run dev          # 开发模式
npm start            # 生产模式
npm test             # 运行测试
node scripts/init-db.js    # 初始化数据库
node scripts/verify-db.js  # 验证数据库
```

### 前端
```bash
cd frontend
npm run dev          # 开发模式
npm run build        # 构建生产版本
npm test             # 运行测试
```

## 数据库

- **数据库名：** daoguan
- **主机：** 103.185.248.4
- **初始管理员：** admin / admin@taoist-temple.com

## API 端点

- 健康检查：`http://localhost:3001/health`
- API 基础：`http://localhost:3001/api`
- 道观列表：`GET /api/temples`
- 道观详情：`GET /api/temples/{id}`

## 故障排除

**MySQL 连接失败：** 检查 `.env` 中的数据库配置  
**端口被占用：** 修改 `.env` 中的 `PORT` 值  
**依赖安装失败：** 运行 `npm cache clean --force && npm install`

## 文档

- [实现状态](./IMPLEMENTATION_STATUS.md)
- [需求文档](./.kiro/specs/taoist-temple-directory/requirements.md)
- [设计文档](./.kiro/specs/taoist-temple-directory/design.md)
- [实现计划](./.kiro/specs/taoist-temple-directory/tasks.md)
- [详细文档](./docs/)
