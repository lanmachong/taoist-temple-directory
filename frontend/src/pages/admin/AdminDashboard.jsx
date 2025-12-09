import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import '../../styles/AdminDashboard.css';

function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    temples: 0,
    reviews: 0,
    users: 0,
    articles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin' && user.role !== 'moderator') {
      navigate('/');
      return;
    }

    setUser(user);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      // 这里可以调用 API 获取统计数据
      // 暂时使用模拟数据
      setStats({
        temples: 150,
        reviews: 500,
        users: 200,
        articles: 50
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>{t('admin.dashboard')}</h1>
        <div className="user-info">
          <span>{user.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            {t('common.logout')}
          </button>
        </div>
      </div>

      <div className="container">
        {/* 统计卡片 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏯</div>
            <div className="stat-content">
              <h3>{t('admin.temples')}</h3>
              <p className="stat-number">{stats.temples}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{t('admin.reviews')}</h3>
              <p className="stat-number">{stats.reviews}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{t('admin.users')}</h3>
              <p className="stat-number">{stats.users}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{t('admin.articles')}</h3>
              <p className="stat-number">{stats.articles}</p>
            </div>
          </div>
        </div>

        {/* 管理菜单 */}
        <div className="admin-menu">
          <h2>{t('admin.management')}</h2>
          <div className="menu-grid">
            <div className="menu-item">
              <h3>🏯 {t('admin.templeManagement')}</h3>
              <p>{t('admin.manageTemples')}</p>
              <button className="menu-btn">{t('common.manage')}</button>
            </div>

            <div className="menu-item">
              <h3>⭐ {t('admin.reviewManagement')}</h3>
              <p>{t('admin.manageReviews')}</p>
              <button className="menu-btn">{t('common.manage')}</button>
            </div>

            <div className="menu-item">
              <h3>📚 {t('admin.classicManagement')}</h3>
              <p>{t('admin.manageClassics')}</p>
              <button className="menu-btn">{t('common.manage')}</button>
            </div>

            <div className="menu-item">
              <h3>📖 {t('admin.articleManagement')}</h3>
              <p>{t('admin.manageArticles')}</p>
              <button className="menu-btn">{t('common.manage')}</button>
            </div>

            <div className="menu-item">
              <h3>👥 {t('admin.userManagement')}</h3>
              <p>{t('admin.manageUsers')}</p>
              <button className="menu-btn">{t('common.manage')}</button>
            </div>

            <div className="menu-item">
              <h3>🔍 {t('admin.seoManagement')}</h3>
              <p>{t('admin.manageSEO')}</p>
              <button className="menu-btn">{t('common.manage')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
