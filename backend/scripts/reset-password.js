#!/usr/bin/env node

/**
 * 重置管理员密码脚本
 * 用法: node scripts/reset-password.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function resetPassword() {
  try {
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log('正在重置管理员密码...');
    console.log('新密码: admin123');
    console.log('密码哈希:', passwordHash);
    
    const connection = await pool.getConnection();
    
    // 更新密码
    const result = await connection.query(
      'UPDATE users SET password_hash = ? WHERE username = ?',
      [passwordHash, 'admin']
    );
    
    connection.release();
    
    if (result[0].affectedRows > 0) {
      console.log('✅ 密码重置成功！');
      console.log('用户名: admin');
      console.log('密码: admin123');
      process.exit(0);
    } else {
      console.log('❌ 管理员用户不存在');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

resetPassword();
