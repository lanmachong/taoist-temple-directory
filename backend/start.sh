#!/bin/bash

# 简单的后端启动脚本
# 用法: bash start.sh

cd /www/wwwroot/daoguan.org/backend

# 重新安装依赖（使用正确的 uuid 版本）
echo "Installing dependencies..."
npm install

# 启动应用
echo "Starting server..."
nohup node src/index.js > logs/app.log 2>&1 &

# 获取进程 ID
PID=$!
echo "Server started with PID: $PID"
echo $PID > logs/app.pid

# 显示日志
echo "Showing logs (Ctrl+C to exit)..."
tail -f logs/app.log
