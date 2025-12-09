const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 获取道观评价列表
router.get('/temples/:templeId', async (req, res) => {
  try {
    const { templeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    // 获取评价列表
    const [reviews] = await connection.query(
      'SELECT id, rating, comment, visitor_name, created_at FROM reviews WHERE temple_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [templeId, parseInt(limit), offset]
    );

    // 获取总数
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM reviews WHERE temple_id = ?',
      [templeId]
    );

    connection.release();

    res.json({
      data: reviews,
      page: parseInt(page),
      limit: parseInt(limit),
      total: countResult[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 提交新评价
router.post('/temples/:templeId', async (req, res) => {
  try {
    const { templeId } = req.params;
    const { rating, comment, visitorName } = req.body;

    // 验证输入
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!visitorName || visitorName.trim() === '') {
      return res.status(400).json({ error: 'Visitor name is required' });
    }

    const connection = await pool.getConnection();

    // 验证道观是否存在
    const [temples] = await connection.query('SELECT id FROM temples WHERE id = ?', [templeId]);
    if (temples.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Temple not found' });
    }

    const reviewId = uuidv4();

    // 插入评价
    await connection.query(
      'INSERT INTO reviews (id, temple_id, rating, comment, visitor_name) VALUES (?, ?, ?, ?, ?)',
      [reviewId, templeId, rating, comment || null, visitorName]
    );

    // 更新道观的平均评分和评价数
    const [ratingResult] = await connection.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE temple_id = ?',
      [templeId]
    );

    await connection.query(
      'UPDATE temples SET average_rating = ?, review_count = ? WHERE id = ?',
      [ratingResult[0].avg_rating.toFixed(2), ratingResult[0].count, templeId]
    );

    connection.release();

    res.status(201).json({
      id: reviewId,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除评价
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'moderator']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    // 获取评价信息
    const [reviews] = await connection.query('SELECT temple_id FROM reviews WHERE id = ?', [id]);
    if (reviews.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Review not found' });
    }

    const templeId = reviews[0].temple_id;

    // 删除评价
    await connection.query('DELETE FROM reviews WHERE id = ?', [id]);

    // 更新道观的平均评分和评价数
    const [ratingResult] = await connection.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE temple_id = ?',
      [templeId]
    );

    const avgRating = ratingResult[0].avg_rating ? ratingResult[0].avg_rating.toFixed(2) : 0;
    await connection.query(
      'UPDATE temples SET average_rating = ?, review_count = ? WHERE id = ?',
      [avgRating, ratingResult[0].count, templeId]
    );

    connection.release();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
