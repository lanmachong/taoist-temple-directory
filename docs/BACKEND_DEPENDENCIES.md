# 道观黄页系统 - 后端依赖说明

## 项目依赖

本项目使用 Node.js 和 npm 进行包管理。所有依赖已在 `package.json` 中定义。

### 安装依赖

```bash
cd taoist-temple-directory/backend
npm install
```

### 生产依赖 (Dependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| express | ^4.18.2 | Web 框架 |
| mysql2 | ^3.6.0 | MySQL 数据库驱动 |
| dotenv | ^16.3.1 | 环境变量管理 |
| jsonwebtoken | ^9.0.2 | JWT 认证 |
| bcryptjs | ^2.4.3 | 密码加密 |
| cors | ^2.8.5 | 跨域资源共享 |
| multer | ^1.4.5-lts.1 | 文件上传处理 |
| express-validator | ^7.0.0 | 输入验证 |

### 开发依赖 (DevDependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| nodemon | ^3.0.1 | 开发时自动重启服务器 |
| jest | ^29.7.0 | 单元测试框架 |
| supertest | ^6.3.3 | HTTP 测试库 |

## 环境要求

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0
- **MySQL**: >= 8.0.0

## 环境变量配置

创建 `.env` 文件，参考 `.env.example`：

```properties
# 数据库配置
DB_HOST=103.185.248.4
DB_PORT=3306
DB_USER=daoguan
DB_PASSWORD=your_password
DB_NAME=daoguan

# 服务器配置
PORT=3001
NODE_ENV=development

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS 配置
CORS_ORIGIN=http://localhost:3000

# 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

## 启动服务

### 开发模式（带自动重启）
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

### 运行测试
```bash
npm test
```

### 初始化数据库
```bash
node scripts/init-db.js
```

### 验证数据库
```bash
node scripts/verify-db.js
```

## 前端依赖

前端项目使用 React，依赖在 `taoist-temple-directory/frontend/package.json` 中定义。

### 安装前端依赖
```bash
cd taoist-temple-directory/frontend
npm install
```

## 部署到宝塔面板

1. 在宝塔面板中创建 Node.js 项目
2. 上传项目文件
3. 运行 `npm install` 安装依赖
4. 配置 `.env` 文件
5. 运行 `node scripts/init-db.js` 初始化数据库
6. 启动应用

## 常见问题

### 1. MySQL 连接失败
- 检查 `.env` 中的数据库配置是否正确
- 确保 MySQL 服务正在运行
- 检查防火墙设置

### 2. 端口被占用
- 修改 `.env` 中的 `PORT` 值
- 或者关闭占用该端口的其他应用

### 3. 文件上传失败
- 确保 `uploads` 目录存在且有写入权限
- 检查 `MAX_FILE_SIZE` 设置

## 更新依赖

```bash
# 检查过期的包
npm outdated

# 更新所有包
npm update

# 更新特定包
npm install package-name@latest
```

## 安全建议

1. 生产环境中修改 `JWT_SECRET`
2. 使用强密码保护数据库
3. 启用 HTTPS
4. 定期更新依赖包
5. 使用环境变量管理敏感信息
