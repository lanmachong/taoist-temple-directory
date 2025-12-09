import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

// 页面导入
import HomePage from './pages/HomePage';
import TempleListPage from './pages/TempleListPage';
import TempleDetailPage from './pages/TempleDetailPage';
import ClassicsPage from './pages/ClassicsPage';
import KnowledgePage from './pages/KnowledgePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// 组件导入
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/temples" element={<TempleListPage />} />
              <Route path="/temples/:id" element={<TempleDetailPage />} />
              <Route path="/classics" element={<ClassicsPage />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
