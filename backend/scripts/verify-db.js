require('dotenv').config();
const mysql = require('mysql2/promise');

async function verifyDatabase() {
  try {
    console.log('正在验证数据库...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // 获取所有表
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [process.env.DB_NAME]
    );

    console.log(`✓ 数据库: ${process.env.DB_NAME}`);
    console.log(`✓ 已创建的表 (${tables.length} 个):\n`);

    for (const table of tables) {
      const [rows] = await connection.query(
        `SELECT COUNT(*) as count FROM ${table.TABLE_NAME}`
      );
      console.log(`  • ${table.TABLE_NAME} (${rows[0].count} 条记录)`);
    }

    await connection.end();
    console.log('\n✓ 数据库验证完成');
    process.exit(0);
  } catch (error) {
    console.error('✗ 验证失败:', error.message);
    process.exit(1);
  }
}

verifyDatabase();
