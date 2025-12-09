const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 获取所有知识文章列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, title, category, image_url, view_count, created_at FROM knowledge WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();
    const [articles] = await connection.query(query, params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM knowledge WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND (title LIKE ? OR content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const [countResult] = await connection.query(countQuery, countParams);
    connection.release();

    res.json({
      data: articles,
      page: parseInt(page),
      limit: parseInt(limit),
      total: countResult[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个知识文章
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    // 获取文章内容
    const [articles] = await connection.query('SELECT * FROM knowledge WHERE id = ?', [id]);

    if (articles.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Article not found' });
    }

    // 增加浏览次数
    await connection.query('UPDATE knowledge SET view_count = view_count + 1 WHERE id = ?', [id]);

    connection.release();

    res.json(articles[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新知识文章
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, titleEn, category, content, contentEn, author, imageUrl } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    const id = uuidv4();
    const connection = await pool.getConnection();

    await connection.query(
      'INSERT INTO knowledge (id, title, title_en, category, content, content_en, author, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, titleEn, category, content, contentEn, author, imageUrl]
    );

    connection.release();

    res.status(201).json({ id, message: 'Article created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新知识文章
router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleEn, category, content, contentEn, author, imageUrl } = req.body;

    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE knowledge SET title=?, title_en=?, category=?, content=?, content_en=?, author=?, image_url=? WHERE id=?',
      [title, titleEn, category, content, contentEn, author, imageUrl, id]
    );

    connection.release();

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除知识文章
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM knowledge WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取知识分类
router.get('/categories/list', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [categories] = await connection.query('SELECT DISTINCT category FROM knowledge WHERE category IS NOT NULL ORDER BY category');
    connection.release();

    res.json({ data: categories.map(c => c.category) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
