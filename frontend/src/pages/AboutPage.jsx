import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/AboutPage.css';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <div className="container">
        <h1>{t('about.title')}</h1>

        {/* 关于我们 */}
        <section className="about-section">
          <h2>{t('about.aboutUs')}</h2>
          <p>
            道观黄页系统是一个致力于宣传和传承道家文化的综合性平台。我们汇集了全国各地的道观信息，
            为广大信众和文化爱好者提供便捷的查询和交流服务。
          </p>
        </section>

        {/* 公益理念 */}
        <section className="mission-section">
          <h2>{t('about.mission')}</h2>
          <div className="mission-cards">
            <div className="mission-card">
              <div className="icon">🏯</div>
              <h3>{t('about.mission1Title')}</h3>
              <p>{t('about.mission1Desc')}</p>
            </div>
            <div className="mission-card">
              <div className="icon">📚</div>
              <h3>{t('about.mission2Title')}</h3>
              <p>{t('about.mission2Desc')}</p>
            </div>
            <div className="mission-card">
              <div className="icon">🤝</div>
              <h3>{t('about.mission3Title')}</h3>
              <p>{t('about.mission3Desc')}</p>
            </div>
          </div>
        </section>

        {/* 打赏模块 */}
        <section className="donation-section">
          <h2>{t('about.support')}</h2>
          <p>{t('about.supportDesc')}</p>
          <div className="donation-methods">
            <div className="donation-method">
              <h3>微信支付</h3>
              <div className="qrcode">
                <img src="/wechat-qr.png" alt="WeChat QR Code" />
              </div>
            </div>
            <div className="donation-method">
              <h3>支付宝</h3>
              <div className="qrcode">
                <img src="/alipay-qr.png" alt="Alipay QR Code" />
              </div>
            </div>
          </div>
        </section>

        {/* 联系我们 */}
        <section className="contact-section">
          <h2>{t('about.contact')}</h2>
          <div className="contact-info">
            <p>
              <strong>{t('about.email')}:</strong> info@taoist-temple.com
            </p>
            <p>
              <strong>{t('about.phone')}:</strong> 400-123-4567
            </p>
            <p>
              <strong>{t('about.address')}:</strong> 中国，北京市，朝阳区
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
