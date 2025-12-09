# 代码更新指南 - 简化版

## 🔧 登录问题 - 立即修复

在宝塔终端中执行：

```bash
cd /www/wwwroot/daoguan.org/backend
node scripts/reset-password.js
```

然后用以下账户登录：
- 用户名：`admin`
- 密码：`admin123`

---

## 📝 代码更新流程（简化版）

### 方式 1：快速更新（推荐）

如果只改了代码，不改依赖：

```bash
# 1. 上传新代码到服务器
# （用 FTP 或宝塔文件管理器上传）

# 2. 重启后端
cd /www/wwwroot/daoguan.org/backend
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9
nohup node src/index.js > logs/app.log 2>&1 &

# 3. 查看日志
tail -f logs/app.log
```

**耗时：2-3 分钟**

### 方式 2：完整更新（改了依赖）

如果改了 `package.json`：

```bash
# 1. 上传新代码

# 2. 重新安装依赖
cd /www/wwwroot/daoguan.org/backend
npm install

# 3. 重启后端
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9
nohup node src/index.js > logs/app.log 2>&1 &

# 4. 查看日志
tail -f logs/app.log
```

**耗时：5-10 分钟**

### 方式 3：前端更新

如果改了前端代码：

```bash
# 1. 上传新代码

# 2. 重新构建
cd /www/wwwroot/daoguan.org/frontend
npm run build

# 3. 复制到网站根目录
cp -r build/* /www/wwwroot/daoguan.org/

# 4. 刷新浏览器（Ctrl+Shift+Delete 清除缓存）
```

**耗时：3-5 分钟**

---

## 🚀 一键更新脚本

创建一个 `update.sh` 脚本，以后直接运行：

```bash
#!/bin/bash

# 后端更新
cd /www/wwwroot/daoguan.org/backend
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
nohup node src/index.js > logs/app.log 2>&1 &
echo "✅ 后端已重启"

# 前端更新（可选）
# cd /www/wwwroot/daoguan.org/frontend
# npm run build
# cp -r build/* /www/wwwroot/daoguan.org/
# echo "✅ 前端已更新"
```

保存为 `/www/wwwroot/daoguan.org/update.sh`，以后直接运行：

```bash
bash /www/wwwroot/daoguan.org/update.sh
```

---

## 📊 对比 Python 部署

| 操作 | Python | Node.js |
|------|--------|---------|
| 更新代码 | `git pull` | 上传文件 |
| 重启服务 | `systemctl restart app` | `kill && nohup node ...` |
| 查看日志 | `tail -f logs/app.log` | `tail -f logs/app.log` |
| 更新依赖 | `pip install -r requirements.txt` | `npm install` |

**Node.js 其实也不复杂，就是命令不同而已。**

---

## 💡 为什么 Node.js 更新比 Python 快？

1. **不需要重新编译** - Python 需要编译 .pyc 文件
2. **热重载** - 可以直接替换文件，不需要重新安装
3. **启动快** - Node.js 启动只需 1-2 秒

---

## 🔄 自动化更新（高级）

如果你用 Git，可以设置自动部署：

```bash
# 在服务器上创建 post-receive hook
cat > /www/wwwroot/daoguan.org/.git/hooks/post-receive << 'EOF'
#!/bin/bash
cd /www/wwwroot/daoguan.org
git checkout -f

# 后端更新
cd backend
npm install
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
nohup node src/index.js > logs/app.log 2>&1 &

# 前端更新
cd ../frontend
npm run build
cp -r build/* /www/wwwroot/daoguan.org/

echo "✅ 自动部署完成"
EOF

chmod +x /www/wwwroot/daoguan.org/.git/hooks/post-receive
```

然后每次 `git push` 就会自动部署。

---

## ✅ 常用命令速查

```bash
# 查看后端是否运行
ps aux | grep "node src/index.js"

# 查看实时日志
tail -f /www/wwwroot/daoguan.org/backend/logs/app.log

# 停止后端
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9

# 启动后端
cd /www/wwwroot/daoguan.org/backend
nohup node src/index.js > logs/app.log 2>&1 &

# 重启后端
ps aux | grep "node src/index.js" | grep -v grep | awk '{print $2}' | xargs kill -9
cd /www/wwwroot/daoguan.org/backend
nohup node src/index.js > logs/app.log 2>&1 &

# 重新安装依赖
cd /www/wwwroot/daoguan.org/backend
npm install

# 构建前端
cd /www/wwwroot/daoguan.org/frontend
npm run build
cp -r build/* /www/wwwroot/daoguan.org/
```

---

## 📞 问题排查

| 问题 | 解决方案 |
|------|--------|
| 后端无法启动 | `tail -f logs/app.log` 查看错误 |
| 登录失败 | `node scripts/reset-password.js` 重置密码 |
| 前端无法加载 | 清除浏览器缓存，重新构建前端 |
| 数据库连接失败 | 检查 `.env` 中的数据库配置 |

---

## ✨ 总结

Node.js 部署其实很简单，就是：
1. 上传文件
2. 重启进程
3. 查看日志

和 Python 没什么区别，只是命令不同而已。
