const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 配置 multer
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// 上传道观图片
router.post('/temples/:templeId', authenticateToken, authorizeRole(['admin', 'moderator']), upload.single('image'), async (req, res) => {
  try {
    const { templeId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 验证道观是否存在
    const connection = await pool.getConnection();
    const [temples] = await connection.query('SELECT id FROM temples WHERE id = ?', [templeId]);

    if (temples.length === 0) {
      connection.release();
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Temple not found' });
    }

    const imageId = uuidv4();
    const imageUrl = `/uploads/${req.file.filename}`;

    await connection.query(
      'INSERT INTO images (id, temple_id, url, filename, uploaded_by) VALUES (?, ?, ?, ?, ?)',
      [imageId, templeId, imageUrl, req.file.filename, req.user.id]
    );

    connection.release();

    res.status(201).json({
      id: imageId,
      url: imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// 删除图片
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'moderator']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [images] = await connection.query('SELECT filename FROM images WHERE id = ?', [id]);

    if (images.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Image not found' });
    }

    const filename = images[0].filename;
    const filePath = path.join(uploadDir, filename);

    // 删除文件
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除数据库记录
    await connection.query('DELETE FROM images WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取道观的所有图片
router.get('/temples/:templeId', async (req, res) => {
  try {
    const { templeId } = req.params;

    const connection = await pool.getConnection();
    const [images] = await connection.query(
      'SELECT id, url, filename, uploaded_at FROM images WHERE temple_id = ? ORDER BY uploaded_at DESC',
      [templeId]
    );
    connection.release();

    res.json({ data: images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
