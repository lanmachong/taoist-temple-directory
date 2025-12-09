# 道观黄页系统 - 前端依赖说明

## 项目依赖

本项目使用 React 和 npm 进行包管理。所有依赖已在 `package.json` 中定义。

### 安装依赖

```bash
cd taoist-temple-directory/frontend
npm install
```

## 前端技术栈

### 核心框架
- **React**: 18.x - UI 库
- **React Router**: 路由管理
- **Axios**: HTTP 客户端

### 国际化
- **i18next**: 多语言支持
- **react-i18next**: React i18next 集成

### UI 和样式
- **CSS Modules**: 样式隔离
- **Responsive Design**: 响应式设计

### 开发工具
- **Vite**: 快速构建工具（推荐）
- **Create React App**: 官方脚手架（可选）

## 推荐的额外依赖

根据项目需求，建议添加以下依赖：

### UI 组件库
```bash
npm install antd                    # Ant Design 组件库
npm install @mui/material           # Material-UI 组件库
npm install react-bootstrap         # Bootstrap React 组件
```

### 状态管理
```bash
npm install redux @reduxjs/toolkit  # Redux 状态管理
npm install zustand                 # 轻量级状态管理
npm install recoil                  # Facebook 状态管理
```

### 表单处理
```bash
npm install react-hook-form         # 高性能表单库
npm install formik yup              # 表单验证
```

### 图片处理
```bash
npm install react-image-lightbox    # 图片灯箱
npm install swiper                  # 轮播库
npm install react-lazy-load-image-component  # 图片懒加载
```

### 工具库
```bash
npm install lodash                  # 工具函数库
npm install moment                  # 日期处理
npm install date-fns                # 现代日期库
npm install uuid                    # UUID 生成
```

### 测试
```bash
npm install @testing-library/react  # React 测试库
npm install @testing-library/jest-dom
npm install vitest                  # Vite 测试框架
```

## 环境要求

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0

## 启动开发服务器

### 使用 Vite（推荐）
```bash
npm run dev
```

### 使用 Create React App
```bash
npm start
```

## 构建生产版本

```bash
npm run build
```

## 运行测试

```bash
npm test
```

## 环境变量配置

创建 `.env` 文件：

```properties
# API 服务器地址
REACT_APP_API_URL=http://localhost:3001/api

# 应用名称
REACT_APP_NAME=道观黄页系统

# 默认语言
REACT_APP_DEFAULT_LANGUAGE=zh
```

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   ├── services/           # API 服务
│   ├── i18n/               # 国际化配置
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   ├── App.jsx             # 主应用
│   └── index.jsx           # 入口文件
├── public/                 # 静态资源
├── package.json
└── vite.config.js          # Vite 配置
```

## 常见问题

### 1. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 重新安装
npm install
```

### 2. 端口被占用
```bash
# 修改 vite.config.js 中的端口
# 或使用环境变量
VITE_PORT=3001 npm run dev
```

### 3. API 连接失败
- 检查 `.env` 中的 `REACT_APP_API_URL` 是否正确
- 确保后端服务正在运行
- 检查 CORS 配置

## 更新依赖

```bash
# 检查过期的包
npm outdated

# 更新所有包
npm update

# 更新特定包
npm install package-name@latest
```

## 性能优化建议

1. 使用代码分割（Code Splitting）
2. 实现图片懒加载
3. 使用 React.memo 优化组件
4. 实现虚拟滚动处理大列表
5. 使用 CDN 加速静态资源

## 安全建议

1. 不要在代码中硬编码敏感信息
2. 使用环境变量管理 API 密钥
3. 验证用户输入
4. 定期更新依赖包
5. 使用 HTTPS 进行通信
