# 需要更新的文件清单

## ⭐ 必须更新的文件

### 1. `backend/package.json`
**位置：** `/www/wwwroot/daoguan.org/backend/package.json`

**修改内容：** UUID 版本从 13.0.0 改为 9.0.0

**本地文件已更新，直接上传即可。**

---

### 2. `backend/src/routes/auth.js`
**位置：** `/www/wwwroot/daoguan.org/backend/src/routes/auth.js`

**修改内容：** 密码验证逻辑已修复，使用 bcrypt 正确验证

**本地文件已更新，直接上传即可。**

---

### 3. `backend/.env`
**位置：** `/www/wwwroot/daoguan.org/backend/.env`

**修改内容：** CORS 配置已更新为 `https://daoguan.org`

**本地文件已更新，直接上传即可。**

---

## 📋 上传步骤

### 方式 1：使用宝塔文件管理器（推荐）

1. 在本地删除 `node_modules` 文件夹
2. 在宝塔面板中：
   - 左侧菜单 → **文件** → **文件管理器**
   - 进入 `/www/wwwroot/daoguan.org/`
   - 删除旧的 `backend` 和 `frontend` 文件夹
   - 上传新的 `backend` 和 `frontend` 文件夹

### 方式 2：使用 FTP（更快）

1. 在宝塔面板中启用 FTP
2. 使用 FTP 客户端（如 FileZilla）
3. 上传 `backend` 和 `frontend` 文件夹到 `/www/wwwroot/daoguan.org/`

---

## ✅ 验证文件是否正确

上传完成后，在宝塔终端中检查：

```bash
# 检查 package.json 中的 uuid 版本
grep "uuid" /www/wwwroot/daoguan.org/backend/package.json

# 应该看到：
# "uuid": "^9.0.0"
```

```bash
# 检查 .env 中的 CORS 配置
grep "CORS_ORIGIN" /www/wwwroot/daoguan.org/backend/.env

# 应该看到：
# CORS_ORIGIN=https://daoguan.org
```

```bash
# 检查 auth.js 中是否有 bcrypt 验证
grep "bcrypt.compare" /www/wwwroot/daoguan.org/backend/src/routes/auth.js

# 应该看到：
# const isValidPassword = await bcrypt.compare(password, user.password_hash);
```

---

## 🚀 上传后的操作

上传完成后，按照 `DEPLOY.md` 中的步骤继续部署。

---

## 📝 文件对比

如果你想看具体改了什么，可以对比以下内容：

### package.json 改动
```diff
- "uuid": "^13.0.0"
+ "uuid": "^9.0.0"
```

### auth.js 改动
```diff
- // 验证密码（这里简化处理，实际应使用 bcrypt）
- if (user.password_hash !== password) {
+ // 验证密码使用 bcrypt
+ const isValidPassword = await bcrypt.compare(password, user.password_hash);
+ if (!isValidPassword) {
```

### .env 改动
```diff
- CORS_ORIGIN=http://localhost:3000
+ CORS_ORIGIN=https://daoguan.org
```

---

## ✨ 完成

所有文件都已准备好，直接上传即可！
