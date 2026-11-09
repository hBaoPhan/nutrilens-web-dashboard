import React, { useState, useEffect, useCallback, useId } from 'react';
import DOMPurify from 'dompurify';
import './MealLogDashboard.css';

export const MealLogDashboard = ({ initialData = [], userId }) => {
  const [mealLogs, setMealLogs] = useState(initialData);
  const [selectedMeal, setSelectedMeal] = useState(initialData[0] || null);
  const [portionRatio, setPortionRatio] = useState(1.0);
  const sliderInputId = useId();

  // Sync state if initialData is fetched asynchronously from backend API
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setMealLogs(initialData);
      setSelectedMeal((prev) => (prev ? initialData.find((m) => m.id === prev.id) || initialData[0] : initialData[0]));
    }
  }, [initialData]);

  const handleSelectMeal = useCallback((meal) => {
    setSelectedMeal(meal);
    setPortionRatio(1.0); // Reset portion for newly selected meal
  }, []);

  const handleSliderChange = (e) => {
    const ratio = parseFloat(e.target.value);
    setPortionRatio(ratio);
  };

  const getSanitizedNotes = (dirtyHtml) => {
    return {
      __html: DOMPurify.sanitize(dirtyHtml || '', {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'span'],
        ALLOWED_ATTR: ['class']
      })
    };
  };

  return (
    <div className="nl-dashboard-container">
      <header className="nl-header">
        <h1 className="nl-title">AR NutriLens - Bảng Nhật Ký Dinh Dưỡng 3D</h1>
        <span className="nl-status-pill">Hệ thống MySQL 8.0 Sẵn sàng</span>
      </header>

      <div className="nl-main-grid">
        {/* Cột trái: Danh sách các bữa ăn đã quét AR */}
        <section className="nl-meal-list-section">
          <h2 className="nl-section-title">Lịch sử quét AR</h2>
          <div className="nl-cards-scroll">
            {mealLogs.length === 0 ? (
              <p className="nl-empty-state">Chưa có bữa ăn nào được ghi nhận</p>
            ) : (
              mealLogs.map((meal) => (
                <button
                  type="button"
                  key={meal.id}
                  onClick={() => handleSelectMeal(meal)}
                  className={`nl-meal-item-btn ${selectedMeal?.id === meal.id ? 'nl-meal-item-active' : ''}`}
                >
                  <div className="nl-meal-item-header">
                    <span className="nl-meal-type-tag">{meal.mealType}</span>
                    <span className="nl-meal-time">{meal.loggedAt}</span>
                  </div>
                  <div className="nl-meal-item-summary">
                    <span data-testid={`kcal-${meal.id}`}>{meal.totalKcal} kcal</span>
                    <span>{meal.totalWeightG}g</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Cột phải: Chi tiết bóc tách thành phần & mô phỏng vận động */}
        {selectedMeal && (
          <section className="nl-detail-section">
            <div className="nl-detail-card">
              <div className="nl-detail-header">
                <div>
                  <h3 className="nl-detail-title">{selectedMeal.foodName || 'Chi tiết bữa ăn'}</h3>
                  <p className="nl-detail-subtitle">Tính toán thể tích từ AR Depth Map &amp; Khối lượng riêng</p>
                </div>
                <div className="nl-burn-badge" data-testid="burn-badge">
                  🏃 {Math.round((selectedMeal.totalKcal * portionRatio) / 10)} phút chạy bộ
                </div>
              </div>

              {/* Tương tác mô phỏng giảm khẩu phần */}
              <div className="nl-portion-controller">
                <div className="nl-slider-header">
                  <label htmlFor={sliderInputId} className="nl-slider-text">
                    Khẩu phần kiểm soát: <strong>{Math.round(portionRatio * 100)}%</strong>
                  </label>
                  <span className="nl-slider-kcal" data-testid="adjusted-kcal">
                    {(selectedMeal.totalKcal * portionRatio).toFixed(1)} kcal
                  </span>
                </div>
                <input
                  id={sliderInputId}
                  data-testid="portion-slider"
                  type="range"
                  min="0.10"
                  max="1.00"
                  step="0.05"
                  value={portionRatio}
                  onChange={handleSliderChange}
                  className="nl-range-input"
                />
              </div>

              {/* Ghi chú từ người dùng - Bảo vệ XSS nghiêm ngặt bằng DOMPurify */}
              {selectedMeal.userNotes && (
                <div className="nl-user-notes-box">
                  <span className="nl-notes-label">Ghi chú người dùng:</span>
                  <div
                    data-testid="user-notes-display"
                    className="nl-notes-content"
                    dangerouslySetInnerHTML={getSanitizedNotes(selectedMeal.userNotes)}
                  />
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
