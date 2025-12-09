const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 获取所有道观列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sect, province, city } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM temples WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sect) {
      query += ' AND sect = ?';
      params.push(sect);
    }

    if (province) {
      query += ' AND address LIKE ?';
      params.push(`%${province}%`);
    }

    if (city) {
      query += ' AND address LIKE ?';
      params.push(`%${city}%`);
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const connection = await pool.getConnection();
    const [temples] = await connection.query(query, params);
    connection.release();

    res.json({ data: temples, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个道观详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [temples] = await connection.query(
      'SELECT * FROM temples WHERE id = ?',
      [id]
    );

    if (temples.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Temple not found' });
    }

    const temple = temples[0];

    // 获取图片
    const [images] = await connection.query(
      'SELECT * FROM images WHERE temple_id = ?',
      [id]
    );

    // 获取评价
    const [reviews] = await connection.query(
      'SELECT * FROM reviews WHERE temple_id = ? ORDER BY created_at DESC',
      [id]
    );

    connection.release();

    res.json({ ...temple, images, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新道观（需认证）
router.post('/', authenticateToken, authorizeRole(['admin', 'moderator']), async (req, res) => {
  try {
    const { name, nameEn, address, addressEn, sect, description, descriptionEn, phone, email, website, latitude, longitude } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: 'Name and address required' });
    }

    const id = uuidv4();
    const connection = await pool.getConnection();

    await connection.query(
      'INSERT INTO temples (id, name, name_en, address, address_en, sect, description, description_en, phone, email, website, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, nameEn, address, addressEn, sect, description, descriptionEn, phone, email, website, latitude, longitude]
    );

    connection.release();

    res.status(201).json({ id, message: 'Temple created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新道观信息（需认证）
router.put('/:id', authenticateToken, authorizeRole(['admin', 'moderator']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameEn, address, addressEn, sect, description, descriptionEn, phone, email, website, latitude, longitude } = req.body;

    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE temples SET name=?, name_en=?, address=?, address_en=?, sect=?, description=?, description_en=?, phone=?, email=?, website=?, latitude=?, longitude=? WHERE id=?',
      [name, nameEn, address, addressEn, sect, description, descriptionEn, phone, email, website, latitude, longitude, id]
    );

    connection.release();

    res.json({ message: 'Temple updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除道观（需认证）
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM temples WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Temple deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
