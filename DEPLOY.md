# 部署指南 - daoguan.org

## 📋 需要更新的文件

**在服务器上替换以下文件：**

| 文件路径 | 说明 |
|---------|------|
| `backend/package.json` | ⭐ **必须更新** - UUID 版本已修复 |
| `backend/src/routes/auth.js` | ⭐ **必须更新** - 密码验证逻辑已修复 |
| `backend/.env` | ⭐ **必须更新** - CORS 配置已修复 |

---

## 🚀 部署步骤（简化版）

### 1️⃣ 上传文件到服务器

上传以下文件夹到 `/www/wwwroot/daoguan.org/`：
- `backend/` （不包含 node_modules）
- `frontend/` （不包含 node_modules）

### 2️⃣ 在宝塔终端中执行

```bash
# 进入后端目录
cd /www/wwwroot/daoguan.org/backend

# 重新安装依赖（类似 pip install）
rm -rf node_modules package-lock.json
npm install

# 创建日志目录
mkdir -p logs

# 启动后端（类似 python manage.py runserver）
nohup node src/index.js > logs/app.log 2>&1 &

# 查看日志
tail -f logs/app.log
```

看到以下输出说明成功：
```
Server is running on port 3001
Environment: production
```

### 3️⃣ 构建前端

```bash
cd /www/wwwroot/daoguan.org/frontend

# 安装依赖
npm install

# 构建（生成 build 文件夹）
npm run build

# 复制到网站根目录
cp -r build/* /www/wwwroot/daoguan.org/
```

### 4️⃣ 配置 Nginx

1. 左侧菜单 → **网站** → 找到 `daoguan.org`
2. 点击 **设置** → **配置文件**
3. **全部替换**为项目中的 `nginx.conf` 文件内容
4. 点击 **保存**
5. 点击 **重启**

### 5️⃣ 配置 SSL 证书

1. 找到 `daoguan.org` 网站
2. 点击 **设置** → **SSL**
3. 选择 **Let's Encrypt**
4. 点击 **申请**

**申请成功后**，更新 Nginx 配置为 HTTPS（参考项目中的 `nginx-https.conf`）

---

## ✅ 验证部署

### 检查后端是否运行

```bash
ps aux | grep "node src/index.js"
```

应该看到进程在运行。

### 测试 API

在浏览器中访问：
```
https://daoguan.org/health
```

应该看到：
```json
{"status":"ok","timestamp":"..."}
```

### 测试登录

访问 `https://daoguan.org/login`，用以下账户登录：
- 用户名：`admin`
- 密码：`admin123`

---

## 🔧 常用命令

| 操作 | 命令 |
|------|------|
| 启动后端 | `cd /www/wwwroot/daoguan.org/backend && nohup node src/index.js > logs/app.log 2>&1 &` |
| 查看日志 | `tail -f /www/wwwroot/daoguan.org/backend/logs/app.log` |
| 停止后端 | `ps aux \| grep "node src/index.js" \| grep -v grep \| awk '{print $2}' \| xargs kill -9` |
| 重启后端 | 先停止，再启动 |

---

## 📝 对比 Python 部署

| Python | Node.js |
|--------|---------|
| `pip install -r requirements.txt` | `npm install` |
| `python manage.py runserver` | `node src/index.js` |
| `nohup python manage.py runserver &` | `nohup node src/index.js > logs/app.log 2>&1 &` |
| `tail -f logs/app.log` | `tail -f logs/app.log` |

---

## 📞 问题排查

**后端无法启动？**
```bash
# 查看详细错误
tail -f /www/wwwroot/daoguan.org/backend/logs/app.log
```

**常见错误：**
- 数据库连接失败 → 检查 `.env` 中的数据库配置
- 端口被占用 → 检查是否有其他进程占用 3001 端口
- 依赖缺失 → 重新运行 `npm install`

---

## ✨ 完成

部署完成后，访问 `https://daoguan.org` 即可使用！
