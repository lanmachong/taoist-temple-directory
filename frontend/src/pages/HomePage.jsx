import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import '../styles/HomePage.css';

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSect, setSelectedSect] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchTemples();
  }, [searchTerm, selectedProvince, selectedCity, selectedSect, sortBy]);

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 12,
        search: searchTerm,
        sect: selectedSect
      };

      const response = await api.get('/temples', { params });
      setTemples(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemples();
  };

  const handleTempleClick = (id) => {
    navigate(`/temples/${id}`);
  };

  return (
    <div className="home-page">
      {/* 搜索和筛选区域 */}
      <section className="search-section">
        <div className="search-container">
          <h1>{t('home.title')}</h1>
          <p className="subtitle">{t('home.subtitle')}</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                {t('common.search')}
              </button>
            </div>

            <div className="filter-group">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="filter-select"
              >
                <option value="">{t('home.allProvinces')}</option>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="广东">广东</option>
                <option value="浙江">浙江</option>
                <option value="江苏">江苏</option>
                <option value="四川">四川</option>
                <option value="陕西">陕西</option>
                <option value="山东">山东</option>
              </select>

              <select
                value={selectedSect}
                onChange={(e) => setSelectedSect(e.target.value)}
                className="filter-select"
              >
                <option value="">{t('home.allSects')}</option>
                <option value="正一派">正一派</option>
                <option value="全真派">全真派</option>
                <option value="其他">其他</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">{t('home.newest')}</option>
                <option value="rating">{t('home.highestRated')}</option>
                <option value="popular">{t('home.mostPopular')}</option>
              </select>
            </div>
          </form>
        </div>
      </section>

      {/* 道观列表区域 */}
      <section className="temples-section">
        <div className="container">
          {loading ? (
            <div className="loading">{t('common.loading')}</div>
          ) : temples.length === 0 ? (
            <div className="no-results">{t('common.noResults')}</div>
          ) : (
            <div className="temples-grid">
              {temples.map((temple) => (
                <div
                  key={temple.id}
                  className="temple-card"
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="temple-image">
                    <img
                      src={temple.image || '/placeholder.jpg'}
                      alt={temple.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="temple-info">
                    <h3>{temple.name}</h3>
                    <p className="temple-address">{temple.address}</p>
                    <div className="temple-meta">
                      <span className="sect">{temple.sect}</span>
                      <span className="rating">
                        ⭐ {temple.average_rating || 0}
                      </span>
                    </div>
                    <p className="temple-description">
                      {temple.description?.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 特色功能区域 */}
      <section className="features-section">
        <div className="container">
          <h2>{t('home.features')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏯</div>
              <h3>{t('home.feature1Title')}</h3>
              <p>{t('home.feature1Desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>{t('home.feature2Title')}</h3>
              <p>{t('home.feature2Desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>{t('home.feature3Title')}</h3>
              <p>{t('home.feature3Desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>{t('home.feature4Title')}</h3>
              <p>{t('home.feature4Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
