import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Header.css';

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');

  const handleNavClick = (path, navName) => {
    setActiveNav(navName);
    navigate(path);
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo" onClick={() => handleNavClick('/', 'home')}>
          🏯 道观黄页
        </div>
        <div className="header-right">
          <nav className="header-nav">
            <div
              className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('/', 'home')}
            >
              {t('nav.home')}
            </div>
            <div
              className={`nav-item ${activeNav === 'temples' ? 'active' : ''}`}
              onClick={() => handleNavClick('/temples', 'temples')}
            >
              {t('nav.temples')}
            </div>
            <div
              className={`nav-item ${activeNav === 'classics' ? 'active' : ''}`}
              onClick={() => handleNavClick('/classics', 'classics')}
            >
              {t('nav.classics')}
            </div>
            <div
              className={`nav-item ${activeNav === 'knowledge' ? 'active' : ''}`}
              onClick={() => handleNavClick('/knowledge', 'knowledge')}
            >
              {t('nav.knowledge')}
            </div>
            <div
              className={`nav-item ${activeNav === 'about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about', 'about')}
            >
              {t('nav.about')}
            </div>
          </nav>
          <select value={i18n.language} onChange={handleLanguageChange} className="language-select">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
          <button onClick={() => handleNavClick('/login', 'login')} className="login-btn">
            {t('nav.login')}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
