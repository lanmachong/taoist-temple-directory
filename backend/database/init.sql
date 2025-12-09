-- 创建数据库
CREATE DATABASE IF NOT EXISTS daoguan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE daoguan;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'moderator', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 道观表
CREATE TABLE IF NOT EXISTS temples (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  address VARCHAR(255) NOT NULL,
  address_en VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  sect VARCHAR(50),
  description LONGTEXT,
  description_en LONGTEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(255),
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_sect (sect),
  INDEX idx_location (latitude, longitude),
  FULLTEXT INDEX ft_search (name, address, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 图片表
CREATE TABLE IF NOT EXISTS images (
  id VARCHAR(36) PRIMARY KEY,
  temple_id VARCHAR(36) NOT NULL,
  url VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(36),
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_temple_id (temple_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY,
  temple_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment LONGTEXT,
  visitor_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE,
  INDEX idx_temple_id (temple_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
  id VARCHAR(36) PRIMARY KEY,
  temple_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (temple_id, user_id),
  INDEX idx_temple_id (temple_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 典籍表
CREATE TABLE IF NOT EXISTS classics (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  title_en VARCHAR(100),
  author VARCHAR(100),
  dynasty VARCHAR(50),
  category VARCHAR(50),
  description LONGTEXT,
  description_en LONGTEXT,
  excerpt LONGTEXT,
  excerpt_en LONGTEXT,
  reference_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_dynasty (dynasty),
  INDEX idx_category (category),
  FULLTEXT INDEX ft_search (title, author, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 知识文章表
CREATE TABLE IF NOT EXISTS knowledge (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  title_en VARCHAR(100),
  category VARCHAR(50),
  content LONGTEXT NOT NULL,
  content_en LONGTEXT,
  author VARCHAR(100),
  image_url VARCHAR(255),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_category (category),
  FULLTEXT INDEX ft_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEO 配置表
CREATE TABLE IF NOT EXISTS seo_config (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36),
  page_type VARCHAR(50),
  title VARCHAR(255),
  description VARCHAR(500),
  keywords VARCHAR(255),
  og_title VARCHAR(255),
  og_description VARCHAR(500),
  og_image VARCHAR(255),
  canonical_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_page (page_id, page_type),
  INDEX idx_page_type (page_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建初始管理员用户（密码：admin123）
INSERT INTO users (id, username, password_hash, email, role, is_active) VALUES
('admin-001', 'admin', '$2a$10$kSLbPOP2BWfd6S3vukEFMO7bHlLldds9juOEm8cGSEdGULvzyzoEu', 'admin@taoist-temple.com', 'admin', TRUE);
