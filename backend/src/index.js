require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const authRoutes = require('./routes/auth');
const templeRoutes = require('./routes/temples');
const reviewRoutes = require('./routes/reviews');
const classicRoutes = require('./routes/classics');
const knowledgeRoutes = require('./routes/knowledge');
const userRoutes = require('./routes/users');
const seoRoutes = require('./routes/seo');
const imageRoutes = require('./routes/images');
const likeRoutes = require('./routes/likes');

// 导入中间件
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/temples', templeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/classics', classicRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/likes', likeRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
