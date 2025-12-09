const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 获取所有用户列表（仅管理员）
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, email, role, is_active, created_at, last_login FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();
    const [users] = await connection.query(query, params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    const [countResult] = await connection.query(countQuery, countParams);
    connection.release();

    res.json({
      data: users,
      page: parseInt(page),
      limit: parseInt(limit),
      total: countResult[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个用户详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 只能查看自己或管理员可以查看任何用户
    if (id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, username, email, role, is_active, created_at, last_login FROM users WHERE id = ?',
      [id]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新用户（仅管理员）
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const connection = await pool.getConnection();

    // 检查用户名和邮箱是否已存在
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    await connection.query(
      'INSERT INTO users (id, username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
      [id, username, email, passwordHash, role]
    );

    connection.release();

    res.status(201).json({ id, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新用户信息
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.id;

    // 只能更新自己或管理员可以更新任何用户
    if (id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const connection = await pool.getConnection();

    if (email) {
      // 检查邮箱是否已被其他用户使用
      const [existing] = await connection.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );

      if (existing.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Email already exists' });
      }

      await connection.query('UPDATE users SET email = ? WHERE id = ?', [email, id]);
    }

    connection.release();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 修改用户角色（仅管理员）
router.put('/:id/role', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'moderator', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    connection.release();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除用户（仅管理员）
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM users WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
