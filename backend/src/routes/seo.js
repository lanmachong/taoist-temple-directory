const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// 获取页面 SEO 信息
router.get('/pages/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;

    const connection = await pool.getConnection();
    const [seoConfigs] = await connection.query(
      'SELECT * FROM seo_config WHERE page_id = ?',
      [pageId]
    );
    connection.release();

    if (seoConfigs.length === 0) {
      return res.status(404).json({ error: 'SEO config not found' });
    }

    res.json(seoConfigs[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新页面 SEO 信息
router.put('/pages/:pageId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { pageId } = req.params;
    const { pageType, title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl } = req.body;

    const connection = await pool.getConnection();

    // 检查是否存在
    const [existing] = await connection.query(
      'SELECT id FROM seo_config WHERE page_id = ?',
      [pageId]
    );

    if (existing.length === 0) {
      // 创建新的 SEO 配置
      const id = uuidv4();
      await connection.query(
        'INSERT INTO seo_config (id, page_id, page_type, title, description, keywords, og_title, og_description, og_image, canonical_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, pageId, pageType, title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl]
      );
    } else {
      // 更新现有的 SEO 配置
      await connection.query(
        'UPDATE seo_config SET page_type=?, title=?, description=?, keywords=?, og_title=?, og_description=?, og_image=?, canonical_url=? WHERE page_id=?',
        [pageType, title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, pageId]
      );
    }

    connection.release();

    res.json({ message: 'SEO config updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取 Sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // 获取所有道观
    const [temples] = await connection.query(
      'SELECT id, updated_at FROM temples ORDER BY updated_at DESC'
    );

    // 获取所有典籍
    const [classics] = await connection.query(
      'SELECT id, updated_at FROM classics ORDER BY updated_at DESC'
    );

    // 获取所有知识文章
    const [knowledge] = await connection.query(
      'SELECT id, updated_at FROM knowledge ORDER BY updated_at DESC'
    );

    connection.release();

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 添加主页
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';

    // 添加道观
    temples.forEach(temple => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/temples/${temple.id}</loc>\n`;
      sitemap += `    <lastmod>${new Date(temple.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    // 添加典籍
    classics.forEach(classic => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/classics/${classic.id}</loc>\n`;
      sitemap += `    <lastmod>${new Date(classic.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    });

    // 添加知识文章
    knowledge.forEach(article => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/knowledge/${article.id}</loc>\n`;
      sitemap += `    <lastmod>${new Date(article.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    res.type('application/xml').send(sitemap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取 robots.txt
router.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${process.env.BASE_URL || 'http://localhost:3000'}/api/seo/sitemap.xml`;

  res.type('text/plain').send(robots);
});

module.exports = router;
