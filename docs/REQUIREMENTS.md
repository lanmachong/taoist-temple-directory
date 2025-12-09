# 道观黄页系统 - 系统要求和依赖

## 系统要求

### 开发环境

#### 必需
- **Node.js**: >= 14.0.0（推荐 16.x 或 18.x）
- **npm**: >= 6.0.0（推荐 8.x 或更高）
- **MySQL**: >= 8.0.0
- **Git**: 用于版本控制

#### 推荐
- **Visual Studio Code**: 代码编辑器
- **Postman**: API 测试工具
- **MySQL Workbench**: 数据库管理工具

### 生产环境

- **宝塔面板**: 服务器管理
- **Nginx**: Web 服务器
- **Node.js**: 应用服务器
- **MySQL**: 数据库服务器

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd taoist-temple-directory
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 安装前端依赖

```bash
cd ../frontend
npm install
```

### 4. 配置环境变量

#### 后端配置

复制 `.env.example` 为 `.env`：

```bash
cd ../backend
cp .env.example .env
```

编辑 `.env` 文件，填入你的数据库信息：

```properties
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=daoguan

PORT=3001
NODE_ENV=development

JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

CORS_ORIGIN=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

#### 前端配置

创建 `.env` 文件：

```bash
cd ../frontend
cat > .env << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=道观黄页系统
REACT_APP_DEFAULT_LANGUAGE=zh
EOF
```

### 5. 初始化数据库

```bash
cd ../backend
node scripts/init-db.js
```

### 6. 验证数据库

```bash
node scripts/verify-db.js
```

## 启动应用

### 开发模式

#### 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:3001` 运行

#### 启动前端服务（新终端）

```bash
cd frontend
npm run dev
```

前端应用将在 `http://localhost:3000` 运行

### 生产模式

#### 构建前端

```bash
cd frontend
npm run build
```

#### 启动后端

```bash
cd backend
npm start
```

## 后端依赖列表

### 生产依赖

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

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| nodemon | ^3.0.1 | 开发时自动重启 |
| jest | ^29.7.0 | 单元测试框架 |
| supertest | ^6.3.3 | HTTP 测试库 |

## 前端依赖列表

### 核心依赖

- react: ^18.x
- react-dom: ^18.x
- react-router-dom: ^6.x
- axios: ^1.x
- i18next: ^23.x
- react-i18next: ^13.x

### 推荐的额外依赖

```bash
# UI 组件库（选择其中一个）
npm install antd                    # Ant Design
npm install @mui/material           # Material-UI
npm install react-bootstrap         # Bootstrap

# 状态管理（可选）
npm install zustand                 # 轻量级状态管理

# 表单处理（可选）
npm install react-hook-form         # 高性能表单

# 图片处理（可选）
npm install swiper                  # 轮播库
npm install react-lazy-load-image-component  # 图片懒加载

# 工具库（可选）
npm install lodash                  # 工具函数
npm install uuid                    # UUID 生成
```

## 数据库初始化

### 自动初始化

```bash
cd backend
node scripts/init-db.js
```

### 手动初始化

1. 使用 MySQL 客户端连接到数据库
2. 执行 `database/init.sql` 文件中的 SQL 语句

### 验证初始化

```bash
node scripts/verify-db.js
```

## 常见问题

### Q: 如何修改数据库连接信息？
A: 编辑 `backend/.env` 文件中的数据库配置项。

### Q: 如何修改 API 服务器地址？
A: 编辑 `frontend/.env` 文件中的 `REACT_APP_API_URL`。

### Q: 如何添加新的依赖包？
A: 使用 `npm install package-name` 命令。

### Q: 如何更新依赖包？
A: 使用 `npm update` 命令。

### Q: 如何运行测试？
A: 使用 `npm test` 命令。

## 部署到宝塔面板

### 1. 上传项目文件

使用宝塔面板的文件管理器上传项目文件。

### 2. 安装依赖

在宝塔面板的终端中运行：

```bash
cd /path/to/project/backend
npm install

cd /path/to/project/frontend
npm install
```

### 3. 配置环境变量

编辑 `backend/.env` 文件，配置数据库和其他信息。

### 4. 初始化数据库

```bash
cd /path/to/project/backend
node scripts/init-db.js
```

### 5. 构建前端

```bash
cd /path/to/project/frontend
npm run build
```

### 6. 配置 Nginx

在宝塔面板中配置 Nginx 反向代理，将请求转发到 Node.js 应用。

### 7. 启动应用

使用宝塔面板的 PM2 或其他进程管理工具启动应用。

## 性能优化建议

### 后端
- 使用数据库连接池
- 实现缓存机制
- 优化数据库查询
- 使用 CDN 加速静态资源

### 前端
- 使用代码分割
- 实现图片懒加载
- 使用 React.memo 优化组件
- 压缩静态资源

## 安全建议

1. 生产环境中修改 `JWT_SECRET`
2. 使用强密码保护数据库
3. 启用 HTTPS
4. 定期更新依赖包
5. 使用环境变量管理敏感信息
6. 实现输入验证和清理
7. 使用 CORS 限制跨域请求

## 支持和帮助

如有问题，请参考：
- [后端依赖说明](./backend/DEPENDENCIES.md)
- [前端依赖说明](./frontend/DEPENDENCIES.md)
- [实现状态](./IMPLEMENTATION_STATUS.md)
- [项目 README](./README.md)
