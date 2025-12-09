const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ error: 'Invalid reference' });
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // 默认错误
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = {
  errorHandler
};
