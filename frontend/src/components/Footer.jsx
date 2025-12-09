import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>{t('footer.about')}</h4>
          <p>{t('footer.aboutDesc')}</p>
        </div>

        <div className="footer-section">
          <h4>{t('footer.links')}</h4>
          <ul>
            <li><a href="/">{t('nav.home')}</a></li>
            <li><a href="/temples">{t('nav.temples')}</a></li>
            <li><a href="/classics">{t('nav.classics')}</a></li>
            <li><a href="/knowledge">{t('nav.knowledge')}</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('footer.contact')}</h4>
          <p>{t('footer.email')}: info@taoist-temple.com</p>
          <p>{t('footer.phone')}: 400-123-4567</p>
        </div>

        <div className="footer-section">
          <h4>{t('footer.support')}</h4>
          <p>{t('footer.supportDesc')}</p>
          <div className="donation-buttons">
            <button className="donation-btn">{t('footer.wechat')}</button>
            <button className="donation-btn">{t('footer.alipay')}</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 {t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;
