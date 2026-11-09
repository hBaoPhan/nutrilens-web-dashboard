import React, { useState, useMemo } from 'react';
import './FoodDatabaseTab.css';

export const FoodDatabaseTab = ({ foods = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const list = ['ALL'];
    foods.forEach((f) => {
      if (f.category && !list.includes(f.category)) {
        list.push(f.category);
      }
    });
    return list;
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchSearch =
        !searchTerm.trim() ||
        (food.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.foodCode || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'ALL' ||
        (food.category || '').toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [foods, searchTerm, selectedCategory]);

  return (
    <div className="nl-food-container">
      <div className="nl-food-header">
        <h1 className="nl-food-heading">Cơ Sở Dữ Liệu Dinh Dưỡng Thực Phẩm</h1>
        <p className="nl-food-subheading">
          Hệ số khối lượng riêng ($\rho = g/cm^3$) dùng cho thuật toán phục dựng thể tích AR Depth Map
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="nl-food-controls">
        <input
          type="search"
          placeholder="Tìm theo tên món ăn hoặc mã món..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="nl-search-input"
        />

        <div className="nl-category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`nl-chip-btn ${selectedCategory === cat ? 'nl-chip-btn-active' : ''}`}
            >
              {cat === 'ALL' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View (Optimized for Smartphone Admin) */}
      <div className="nl-food-cards-list">
        {filteredFoods.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
            Không tìm thấy món ăn nào phù hợp
          </p>
        ) : (
          filteredFoods.map((food) => (
            <article key={food.id || food.foodCode} className="nl-food-card">
              <div className="nl-food-card-top">
                <span className="nl-food-emoji">{food.emoji || '🍲'}</span>
                <div className="nl-food-title-group">
                  <span className="nl-food-name">{food.displayName}</span>
                  <span className="nl-food-code">{food.foodCode}</span>
                </div>
              </div>

              <div className="nl-food-metrics-grid">
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Calo</span>
                  <span className="nl-metric-value">{food.kcalPer100g} kcal</span>
                </div>
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Đạm</span>
                  <span className="nl-metric-value">{food.proteinPer100g}g</span>
                </div>
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Carb</span>
                  <span className="nl-metric-value">{food.carbPer100g}g</span>
                </div>
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Béo</span>
                  <span className="nl-metric-value">{food.fatPer100g}g</span>
                </div>
              </div>

              <div className="nl-food-density-badge">
                Khối lượng riêng $\rho$: <strong>{food.densityGPerCm3 || 0.85} g/cm³</strong>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Desktop Data Grid View */}
      <div className="nl-food-table-wrapper">
        <table className="nl-food-table">
          <thead>
            <tr>
              <th className="nl-table-th">Món Ăn</th>
              <th className="nl-table-th">Mã Code</th>
              <th className="nl-table-th">Phân loại</th>
              <th className="nl-table-th">Mật độ $\rho$ (g/cm³)</th>
              <th className="nl-table-th">Calo/100g</th>
              <th className="nl-table-th">Protein</th>
              <th className="nl-table-th">Carb</th>
              <th className="nl-table-th">Fat</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.map((food) => (
              <tr key={food.id || food.foodCode} className="nl-table-row">
                <td className="nl-table-td">
                  <span style={{ marginRight: '0.5rem' }}>{food.emoji || '🍲'}</span>
                  <strong>{food.displayName}</strong>
                </td>
                <td className="nl-table-td" style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                  {food.foodCode}
                </td>
                <td className="nl-table-td">{food.category || 'Chung'}</td>
                <td className="nl-table-td" style={{ color: '#0284c7', fontWeight: 600 }}>
                  {food.densityGPerCm3} g/cm³
                </td>
                <td className="nl-table-td" style={{ fontWeight: 700 }}>
                  {food.kcalPer100g} kcal
                </td>
                <td className="nl-table-td">{food.proteinPer100g}g</td>
                <td className="nl-table-td">{food.carbPer100g}g</td>
                <td className="nl-table-td">{food.fatPer100g}g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
