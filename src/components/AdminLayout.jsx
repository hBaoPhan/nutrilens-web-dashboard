import React from 'react';
import './AdminLayout.css';

export const NAV_TABS = {
  OVERVIEW: 'OVERVIEW',
  FOODS: 'FOODS',
  MEAL_LOGS: 'MEAL_LOGS',
  TIPS: 'TIPS'
};

export const AdminLayout = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenLogin,
  onLogout,
  children
}) => {
  return (
    <div className="nl-layout-container">
      {/* Sticky Responsive Header */}
      <header className="nl-topbar">
        <div className="nl-topbar-inner">
          <div className="nl-brand-section">
            <div className="nl-brand-logo">NL</div>
            <div className="nl-brand-text">
              <span className="nl-brand-title">AR NutriLens Admin</span>
              <span className="nl-brand-badge">Mobile &amp; Web Control Center</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="nl-desktop-nav" aria-label="Desktop Navigation">
            <button
              type="button"
              onClick={() => onTabChange(NAV_TABS.OVERVIEW)}
              className={`nl-nav-tab ${activeTab === NAV_TABS.OVERVIEW ? 'nl-nav-tab-active' : ''}`}
            >
              <span>📊</span>
              <span>Tổng quan</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange(NAV_TABS.FOODS)}
              className={`nl-nav-tab ${activeTab === NAV_TABS.FOODS ? 'nl-nav-tab-active' : ''}`}
            >
              <span>🥗</span>
              <span>CSDL Món ăn</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange(NAV_TABS.MEAL_LOGS)}
              className={`nl-nav-tab ${activeTab === NAV_TABS.MEAL_LOGS ? 'nl-nav-tab-active' : ''}`}
            >
              <span>📷</span>
              <span>Nhật ký AR 3D</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange(NAV_TABS.TIPS)}
              className={`nl-nav-tab ${activeTab === NAV_TABS.TIPS ? 'nl-nav-tab-active' : ''}`}
            >
              <span>💡</span>
              <span>Lời khuyên</span>
            </button>
          </nav>

          {/* Controls & Auth State */}
          <div className="nl-controls-section">
            <span className="nl-status-indicator">
              <span className="nl-status-dot" />
              <span>Hệ thống 8.0</span>
            </span>

            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="nl-auth-btn nl-logout-btn"
                title={`Đăng xuất (${currentUser.username})`}
              >
                {currentUser.username} (Thoát)
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="nl-auth-btn"
              >
                Đăng nhập Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="nl-main-content">
        {children}
      </main>

      {/* Mobile-First Bottom Navigation Bar (Hidden on Desktop) */}
      <nav className="nl-mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          type="button"
          onClick={() => onTabChange(NAV_TABS.OVERVIEW)}
          className={`nl-mobile-nav-item ${activeTab === NAV_TABS.OVERVIEW ? 'nl-mobile-nav-item-active' : ''}`}
        >
          <span className="nl-mobile-nav-icon">📊</span>
          <span>Tổng quan</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange(NAV_TABS.FOODS)}
          className={`nl-mobile-nav-item ${activeTab === NAV_TABS.FOODS ? 'nl-mobile-nav-item-active' : ''}`}
        >
          <span className="nl-mobile-nav-icon">🥗</span>
          <span>Món ăn</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange(NAV_TABS.MEAL_LOGS)}
          className={`nl-mobile-nav-item ${activeTab === NAV_TABS.MEAL_LOGS ? 'nl-mobile-nav-item-active' : ''}`}
        >
          <span className="nl-mobile-nav-icon">📷</span>
          <span>Nhật ký AR</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange(NAV_TABS.TIPS)}
          className={`nl-mobile-nav-item ${activeTab === NAV_TABS.TIPS ? 'nl-mobile-nav-item-active' : ''}`}
        >
          <span className="nl-mobile-nav-icon">💡</span>
          <span>Lời khuyên</span>
        </button>
      </nav>
    </div>
  );
};
