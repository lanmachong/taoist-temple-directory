import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import '../styles/KnowledgePage.css';

function KnowledgePage() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, [searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/knowledge/categories/list');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        search: searchTerm,
        category: selectedCategory
      };

      const response = await api.get('/knowledge', { params });
      setArticles(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleArticleClick = async (article) => {
    try {
      const response = await api.get(`/knowledge/${article.id}`);
      setSelectedArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch article:', error);
    }
  };

  return (
    <div className="knowledge-page">
      <div className="container">
        <h1>{t('knowledge.title')}</h1>

        {/* 搜索和筛选 */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-group">
            <input
              type="text"
              placeholder={t('knowledge.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">{t('knowledge.allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button type="submit" className="search-btn">
              {t('common.search')}
            </button>
          </div>
        </form>

        {/* 内容区域 */}
        <div className="knowledge-content">
          {/* 左侧列表 */}
          <div className="articles-list">
            {loading ? (
              <div className="loading">{t('common.loading')}</div>
            ) : articles.length === 0 ? (
              <div className="no-results">{t('common.noResults')}</div>
            ) : (
              articles.map((article) => (
                <div
                  key={article.id}
                  className={`article-item ${
                    selectedArticle?.id === article.id ? 'active' : ''
                  }`}
                  onClick={() => handleArticleClick(article)}
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="article-thumbnail"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="article-info">
                    <h4>{article.title}</h4>
                    <p className="category">{article.category}</p>
                    <p className="views">👁️ {article.view_count}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 右侧详情 */}
          <div className="article-detail">
            {selectedArticle ? (
              <>
                <h2>{selectedArticle.title}</h2>
                <div className="detail-meta">
                  <span className="category">{selectedArticle.category}</span>
                  <span className="author">{selectedArticle.author}</span>
                  <span className="views">👁️ {selectedArticle.view_count}</span>
                </div>
                {selectedArticle.image_url && (
                  <img
                    src={selectedArticle.image_url}
                    alt={selectedArticle.title}
                    className="article-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="content">
                  <p>{selectedArticle.content}</p>
                </div>
              </>
            ) : (
              <div className="no-selection">{t('knowledge.selectArticle')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgePage;
