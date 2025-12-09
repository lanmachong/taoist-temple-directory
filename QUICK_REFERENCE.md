# 快速参考卡片

## 🔧 npm 镜像源问题

如果 `npm install` 报错 404，执行：

```bash
# 切换到官方镜像源
npm config set registry https://registry.npmjs.org/

# 清除缓存
npm cache clean --force

# 重新安装
cd /www/wwwroot/daoguan.org/backend
rm -rf node_modules package-lock.json
npm install
```

或使用国内镜像源：

```bash
npm config set registry https://registry.npmmirror.com/
npm cache clean --force
npm install
```

---

## 📋 部署检查清单

- [ ] 上传 `backend/` 和 `frontend/` 到服务器
- [ ] 运行 `npm install` 安装依赖
- [ ] 运行 `npm run build` 构建前端
- [ ] 复制前端文件到网站根目录
- [ ] 更新 Nginx 配置（使用 `nginx.conf` - HTTP 版本）
- [ ] 启动后端：`nohup node src/index.js > logs/app.log 2>&1 &`
- [ ] 申请 SSL 证书
- [ ] 更新 Nginx 配置（使用 `nginx-https.conf` - HTTPS 版本）
- [ ] 测试访问 `https://daoguan.org`

---

## 🚀 一键启动脚本

在宝塔终端中复制粘贴：

```bash
# 1. 安装依赖
cd /www/wwwroot/daoguan.org/backend
npm config set registry https://registry.npmjs.org/
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 2. 创建日志目录
mkdir -p logs

# 3. 启动后端
nohup node src/index.js > logs/app.log 2>&1 &

# 4. 查看日志
tail -f logs/app.log
```

---

## 📝 常用命令

```bash
# 查看后端是否运行
ps aux | grep "node src/index.js"

# 查看实时日志
tail -f /www/wwwroot/daoguan.org/backend/logs/app.log

# 停止后端
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9

# 重启后端
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9
cd /www/wwwroot/daoguan.org/backend
nohup node src/index.js > logs/app.log 2>&1 &
```

---

## ✅ 验证部署

```bash
# 1. 检查后端进程
ps aux | grep "node src/index.js"

# 2. 测试 API
curl https://daoguan.org/health

# 3. 测试登录
# 访问 https://daoguan.org/login
# 用户名：admin
# 密码：admin123
```

---

## 📞 常见问题

| 问题 | 解决方案 |
|------|--------|
| npm install 报错 404 | 切换镜像源：`npm config set registry https://registry.npmjs.org/` |
| 后端无法启动 | 查看日志：`tail -f logs/app.log` |
| 端口被占用 | 检查进程：`ps aux \| grep "node src/index.js"` |
| 数据库连接失败 | 检查 `.env` 文件中的数据库配置 |
| 前端无法加载 | 检查 Nginx 配置是否正确 |

---

## 📂 文件结构

```
/www/wwwroot/daoguan.org/
├── backend/
│   ├── src/
│   ├── database/
│   ├── scripts/
│   ├── logs/              ← 日志目录
│   ├── uploads/           ← 上传文件目录
│   ├── package.json       ← ⭐ 已更新
│   ├── .env               ← ⭐ 已更新
│   └── node_modules/      ← npm install 生成
├── frontend/
│   ├── src/
│   ├── public/
│   ├── build/             ← npm run build 生成
│   └── package.json
├── index.html             ← 前端入口
├── static/                ← 前端静态文件
└── uploads/               ← 上传文件
```

---

## 🎯 部署完成标志

✅ 所有步骤完成后：
- 访问 `https://daoguan.org` 能看到网站
- 访问 `https://daoguan.org/login` 能登录
- 访问 `https://daoguan.org/health` 返回 JSON
- 后端日志显示 "Server is running on port 3001"
