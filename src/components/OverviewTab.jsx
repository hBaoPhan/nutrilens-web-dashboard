import React, { useMemo } from 'react';
import './OverviewTab.css';
import { NAV_TABS } from './AdminLayout';

export const OverviewTab = ({ foods = [], mealLogs = [], tips = [], onNavigateTab }) => {
  // Memoized KPI calculations for peak performance
  const avgKcal = useMemo(() => {
    if (!mealLogs.length) return 0;
    const sum = mealLogs.reduce((acc, curr) => acc + (Number(curr.totalKcal) || 0), 0);
    return Math.round(sum / mealLogs.length);
  }, [mealLogs]);

  return (
    <div className="nl-overview-container">
      <div className="nl-overview-header">
        <h1 className="nl-overview-heading">Bảng Điều Khiển Hệ Thống NutriLens</h1>
        <p className="nl-overview-subheading">
          Giám sát trạng thái thời gian thực của thuật toán AR 3D &amp; CSDL Dinh dưỡng
        </p>
      </div>

      {/* KPI Stats Grid */}
      <section className="nl-kpi-grid">
        <div className="nl-kpi-card">
          <div className="nl-kpi-top">
            <span className="nl-kpi-label">CSDL Món Ăn</span>
            <span className="nl-kpi-icon">🍲</span>
          </div>
          <div className="nl-kpi-value">{foods.length}</div>
          <div className="nl-kpi-footer">
            <span>✓ Đã kiểm định calo</span>
          </div>
        </div>

        <div className="nl-kpi-card">
          <div className="nl-kpi-top">
            <span className="nl-kpi-label">Lượt Quét AR</span>
            <span className="nl-kpi-icon">📷</span>
          </div>
          <div className="nl-kpi-value">{mealLogs.length}</div>
          <div className="nl-kpi-footer">
            <span>✓ Đo thể tích 3D</span>
          </div>
        </div>

        <div className="nl-kpi-card">
          <div className="nl-kpi-top">
            <span className="nl-kpi-label">Calo TB / Bữa</span>
            <span className="nl-kpi-icon">🔥</span>
          </div>
          <div className="nl-kpi-value">{avgKcal}</div>
          <div className="nl-kpi-footer">
            <span>kcal / bữa ăn</span>
          </div>
        </div>

        <div className="nl-kpi-card">
          <div className="nl-kpi-top">
            <span className="nl-kpi-label">Tips Dinh Dưỡng</span>
            <span className="nl-kpi-icon">💡</span>
          </div>
          <div className="nl-kpi-value">{tips.length}</div>
          <div className="nl-kpi-footer">
            <span>Đang phát hành</span>
          </div>
        </div>
      </section>

      {/* Microservices Architecture Status */}
      <section className="nl-services-card">
        <h2 className="nl-card-title">
          <span>⚙️</span>
          <span>Trạng thái Microservices &amp; Hạ tầng Backend</span>
        </h2>
        <div className="nl-services-list">
          <div className="nl-service-item">
            <div className="nl-service-info">
              <span className="nl-service-name">Spring Boot Backend Core</span>
              <span className="nl-service-port">Port 8080 (REST + JWT Security)</span>
            </div>
            <span className="nl-service-badge">ACTIVE</span>
          </div>

          <div className="nl-service-item">
            <div className="nl-service-info">
              <span className="nl-service-name">FastAPI YOLOv8-seg Service</span>
              <span className="nl-service-port">Port 8000 (Vietnamese Food AI)</span>
            </div>
            <span className="nl-service-badge">ACTIVE</span>
          </div>

          <div className="nl-service-item">
            <div className="nl-service-info">
              <span className="nl-service-name">MySQL 8.0 InnoDB Database</span>
              <span className="nl-service-port">Port 3306 (utf8mb4 Unicode)</span>
            </div>
            <span className="nl-service-badge">HEALTHY</span>
          </div>
        </div>
      </section>

      {/* Fast Navigation Quick Actions */}
      <section>
        <h2 className="nl-card-title">
          <span>⚡</span>
          <span>Truy cập nhanh quản trị</span>
        </h2>
        <div className="nl-quick-actions-grid">
          <button
            type="button"
            onClick={() => onNavigateTab(NAV_TABS.FOODS)}
            className="nl-action-btn"
          >
            <span className="nl-action-icon">🥗</span>
            <span className="nl-action-title">Tra cứu Món ăn</span>
            <span className="nl-action-desc">Khối lượng riêng $\rho$, Calo, Macro</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab(NAV_TABS.MEAL_LOGS)}
            className="nl-action-btn"
          >
            <span className="nl-action-icon">📸</span>
            <span className="nl-action-title">Nhật ký Quét 3D</span>
            <span className="nl-action-desc">Mô phỏng khẩu phần &amp; chạy bộ</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab(NAV_TABS.TIPS)}
            className="nl-action-btn"
          >
            <span className="nl-action-icon">📝</span>
            <span className="nl-action-title">Tạo Lời Khuyên</span>
            <span className="nl-action-desc">Soạn nội dung giáo dục dinh dưỡng</span>
          </button>

          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="nl-action-btn"
          >
            <span className="nl-action-icon">📑</span>
            <span className="nl-action-title">Swagger API Docs</span>
            <span className="nl-action-desc">Tài liệu API Spring Boot</span>
          </a>
        </div>
      </section>
    </div>
  );
};
