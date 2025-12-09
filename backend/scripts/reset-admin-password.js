require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

async function resetAdminPassword() {
  try {
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE users SET password_hash = ? WHERE username = ?',
      [passwordHash, 'admin']
    );

    connection.release();

    console.log('✓ 管理员密码已重置');
    console.log('用户名: admin');
    console.log('密码: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ 重置密码失败:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
