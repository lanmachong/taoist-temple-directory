import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import '../styles/ClassicsPage.css';

function ClassicsPage() {
  const { t } = useTranslation();
  const [classics, setClassics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassic, setSelectedClassic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDynasty, setSelectedDynasty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchClassics();
  }, [searchTerm, selectedDynasty, selectedCategory]);

  const fetchClassics = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        search: searchTerm,
        dynasty: selectedDynasty,
        category: selectedCategory
      };

      const response = await api.get('/classics', { params });
      setClassics(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch classics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClassics();
  };

  return (
    <div className="classics-page">
      <div className="container">
        <h1>{t('classics.title')}</h1>

        {/* 搜索和筛选 */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-group">
            <input
              type="text"
              placeholder={t('classics.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedDynasty}
              onChange={(e) => setSelectedDynasty(e.target.value)}
              className="filter-select"
            >
              <option value="">{t('classics.allDynasties')}</option>
              <option value="先秦">先秦</option>
              <option value="汉">汉</option>
              <option value="唐">唐</option>
              <option value="宋">宋</option>
              <option value="元">元</option>
              <option value="明">明</option>
              <option value="清">清</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">{t('classics.allCategories')}</option>
              <option value="道德经">道德经</option>
              <option value="庄子">庄子</option>
              <option value="黄帝内经">黄帝内经</option>
              <option value="其他">其他</option>
            </select>
            <button type="submit" className="search-btn">
              {t('common.search')}
            </button>
          </div>
        </form>

        {/* 内容区域 */}
        <div className="classics-content">
          {/* 左侧列表 */}
          <div className="classics-list">
            {loading ? (
              <div className="loading">{t('common.loading')}</div>
            ) : classics.length === 0 ? (
              <div className="no-results">{t('common.noResults')}</div>
            ) : (
              classics.map((classic) => (
                <div
                  key={classic.id}
                  className={`classic-item ${
                    selectedClassic?.id === classic.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedClassic(classic)}
                >
                  <h4>{classic.title}</h4>
                  <p className="author">{classic.author}</p>
                  <p className="dynasty">{classic.dynasty}</p>
                </div>
              ))
            )}
          </div>

          {/* 右侧详情 */}
          <div className="classic-detail">
            {selectedClassic ? (
              <>
                <h2>{selectedClassic.title}</h2>
                <div className="detail-meta">
                  <span>{selectedClassic.author}</span>
                  <span>{selectedClassic.dynasty}</span>
                  <span>{selectedClassic.category}</span>
                </div>
                <div className="description">
                  <h3>{t('classics.description')}</h3>
                  <p>{selectedClassic.description}</p>
                </div>
                {selectedClassic.excerpt && (
                  <div className="excerpt">
                    <h3>{t('classics.excerpt')}</h3>
                    <p>{selectedClassic.excerpt}</p>
                  </div>
                )}
                {selectedClassic.reference_link && (
                  <div className="reference">
                    <a
                      href={selectedClassic.reference_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('classics.readMore')}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="no-selection">{t('classics.selectClassic')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassicsPage;
