const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 获取所有典籍列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, dynasty, category } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM classics WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (dynasty) {
      query += ' AND dynasty = ?';
      params.push(dynasty);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();
    const [classics] = await connection.query(query, params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM classics WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND (title LIKE ? OR author LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (dynasty) {
      countQuery += ' AND dynasty = ?';
      countParams.push(dynasty);
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const [countResult] = await connection.query(countQuery, countParams);
    connection.release();

    res.json({
      data: classics,
      page: parseInt(page),
      limit: parseInt(limit),
      total: countResult[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个典籍详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [classics] = await connection.query('SELECT * FROM classics WHERE id = ?', [id]);
    connection.release();

    if (classics.length === 0) {
      return res.status(404).json({ error: 'Classic not found' });
    }

    res.json(classics[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新典籍
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, titleEn, author, dynasty, category, description, descriptionEn, excerpt, excerptEn, referenceLink } = req.body;

    if (!title || !dynasty || !category) {
      return res.status(400).json({ error: 'Title, dynasty, and category are required' });
    }

    const id = uuidv4();
    const connection = await pool.getConnection();

    await connection.query(
      'INSERT INTO classics (id, title, title_en, author, dynasty, category, description, description_en, excerpt, excerpt_en, reference_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, titleEn, author, dynasty, category, description, descriptionEn, excerpt, excerptEn, referenceLink]
    );

    connection.release();

    res.status(201).json({ id, message: 'Classic created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新典籍信息
router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleEn, author, dynasty, category, description, descriptionEn, excerpt, excerptEn, referenceLink } = req.body;

    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE classics SET title=?, title_en=?, author=?, dynasty=?, category=?, description=?, description_en=?, excerpt=?, excerpt_en=?, reference_link=? WHERE id=?',
      [title, titleEn, author, dynasty, category, description, descriptionEn, excerpt, excerptEn, referenceLink, id]
    );

    connection.release();

    res.json({ message: 'Classic updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除典籍
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM classics WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Classic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
