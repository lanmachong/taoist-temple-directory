const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 为道观点赞
router.post('/temples/:templeId', authenticateToken, async (req, res) => {
  try {
    const { templeId } = req.params;
    const userId = req.user.id;

    const connection = await pool.getConnection();

    // 验证道观是否存在
    const [temples] = await connection.query('SELECT id FROM temples WHERE id = ?', [templeId]);
    if (temples.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Temple not found' });
    }

    // 检查是否已经点赞
    const [existingLike] = await connection.query(
      'SELECT id FROM likes WHERE temple_id = ? AND user_id = ?',
      [templeId, userId]
    );

    if (existingLike.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Already liked' });
    }

    const likeId = uuidv4();

    // 添加点赞
    await connection.query(
      'INSERT INTO likes (id, temple_id, user_id) VALUES (?, ?, ?)',
      [likeId, templeId, userId]
    );

    // 更新道观的点赞数
    await connection.query(
      'UPDATE temples SET like_count = like_count + 1 WHERE id = ?',
      [templeId]
    );

    connection.release();

    res.status(201).json({ id: likeId, message: 'Liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取消点赞
router.delete('/temples/:templeId', authenticateToken, async (req, res) => {
  try {
    const { templeId } = req.params;
    const userId = req.user.id;

    const connection = await pool.getConnection();

    // 检查点赞是否存在
    const [likes] = await connection.query(
      'SELECT id FROM likes WHERE temple_id = ? AND user_id = ?',
      [templeId, userId]
    );

    if (likes.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Like not found' });
    }

    // 删除点赞
    await connection.query(
      'DELETE FROM likes WHERE temple_id = ? AND user_id = ?',
      [templeId, userId]
    );

    // 更新道观的点赞数
    await connection.query(
      'UPDATE temples SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?',
      [templeId]
    );

    connection.release();

    res.json({ message: 'Unlike successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取道观的点赞数
router.get('/temples/:templeId/count', async (req, res) => {
  try {
    const { templeId } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'SELECT COUNT(*) as count FROM likes WHERE temple_id = ?',
      [templeId]
    );
    connection.release();

    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 检查用户是否已点赞
router.get('/temples/:templeId/check', authenticateToken, async (req, res) => {
  try {
    const { templeId } = req.params;
    const userId = req.user.id;

    const connection = await pool.getConnection();
    const [likes] = await connection.query(
      'SELECT id FROM likes WHERE temple_id = ? AND user_id = ?',
      [templeId, userId]
    );
    connection.release();

    res.json({ liked: likes.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
