import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import '../styles/TempleListPage.css';

function TempleListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSect, setSelectedSect] = useState('');

  const limit = 20;

  useEffect(() => {
    fetchTemples();
  }, [page, searchTerm, selectedSect]);

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: searchTerm,
        sect: selectedSect
      };

      const response = await api.get('/temples', { params });
      setTemples(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Failed to fetch temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTemples();
  };

  const handleTempleClick = (id) => {
    navigate(`/temples/${id}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="temple-list-page">
      <div className="container">
        <h1>{t('temples.title')}</h1>

        {/* 搜索和筛选 */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-group">
            <input
              type="text"
              placeholder={t('temples.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedSect}
              onChange={(e) => setSelectedSect(e.target.value)}
              className="filter-select"
            >
              <option value="">{t('temples.allSects')}</option>
              <option value="正一派">正一派</option>
              <option value="全真派">全真派</option>
              <option value="其他">其他</option>
            </select>
            <button type="submit" className="search-btn">
              {t('common.search')}
            </button>
          </div>
        </form>

        {/* 道观列表 */}
        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : temples.length === 0 ? (
          <div className="no-results">{t('common.noResults')}</div>
        ) : (
          <>
            <div className="temples-list">
              {temples.map((temple) => (
                <div
                  key={temple.id}
                  className="temple-item"
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="temple-item-image">
                    <img
                      src={temple.image || '/placeholder.jpg'}
                      alt={temple.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="temple-item-content">
                    <h3>{temple.name}</h3>
                    <p className="address">{temple.address}</p>
                    <div className="meta">
                      <span className="sect">{temple.sect}</span>
                      <span className="rating">⭐ {temple.average_rating || 0}</span>
                      <span className="reviews">
                        {temple.review_count} {t('common.reviews')}
                      </span>
                    </div>
                    <p className="description">
                      {temple.description?.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="page-btn"
                >
                  {t('common.previous')}
                </button>
                <span className="page-info">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="page-btn"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TempleListPage;
