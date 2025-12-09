const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // 验证密码使用 bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 验证认证状态
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 登出
router.post('/logout', authenticateToken, (req, res) => {
  // JWT 是无状态的，客户端删除 token 即可
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
