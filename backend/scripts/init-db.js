require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('正在连接到数据库...');
    
    // 创建连接池
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✓ 数据库连接成功');

    // 读取 SQL 初始化脚本
    const sqlFilePath = path.join(__dirname, '../database/init.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('正在执行数据库初始化脚本...');
    
    // 执行 SQL 脚本
    await connection.query(sql);

    console.log('✓ 数据库初始化成功');
    console.log('✓ 所有数据表已创建');

    await connection.end();
    console.log('✓ 数据库连接已关闭');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ 数据库初始化失败:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
