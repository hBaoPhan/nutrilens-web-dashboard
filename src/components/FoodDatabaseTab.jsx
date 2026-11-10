import React, { useState, useMemo } from 'react';
import './FoodDatabaseTab.css';

export const FoodDatabaseTab = ({ foods = [], onAddFood, onUpdateFood, onDeleteFood }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    foodCode: '',
    displayName: '',
    category: 'Lunch',
    densityGramsPerCm3: '0.85',
    kcalPer100g: '150',
    proteinPer100g: '8.0',
    carbPer100g: '20.0',
    fatPer100g: '4.0',
    emoji: '🍲'
  });

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

  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFormData({
      foodCode: '',
      displayName: '',
      category: 'Lunch',
      densityGramsPerCm3: '0.85',
      kcalPer100g: '150',
      proteinPer100g: '8.0',
      carbPer100g: '20.0',
      fatPer100g: '4.0',
      emoji: '🍲'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      foodCode: food.foodCode || '',
      displayName: food.displayName || food.name || '',
      category: food.category || 'Lunch',
      densityGramsPerCm3: String(food.densityGPerCm3 || food.densityGramsPerCm3 || 0.85),
      kcalPer100g: String(food.kcalPer100g || food.kcal || 100),
      proteinPer100g: String(food.proteinPer100g || food.proteinG || 5),
      carbPer100g: String(food.carbPer100g || food.carbsG || 15),
      fatPer100g: String(food.fatPer100g || food.fatG || 3),
      emoji: food.emoji || '🍲'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      foodCode: formData.foodCode.trim().toUpperCase(),
      displayName: formData.displayName.trim(),
      category: formData.category,
      densityGramsPerCm3: parseFloat(formData.densityGramsPerCm3),
      kcalPer100g: parseFloat(formData.kcalPer100g),
      proteinPer100g: parseFloat(formData.proteinPer100g),
      carbPer100g: parseFloat(formData.carbPer100g),
      fatPer100g: parseFloat(formData.fatPer100g),
      emoji: formData.emoji.trim()
    };

    try {
      if (editingFood && onUpdateFood) {
        await onUpdateFood(editingFood.id, payload);
      } else if (onAddFood) {
        await onAddFood(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi lưu thông tin món ăn');
    }
  };

  return (
    <div className="nl-food-container">
      <div className="nl-food-header-row">
        <div>
          <h1 className="nl-food-heading">Cơ Sở Dữ Liệu Dinh Dưỡng Thực Phẩm</h1>
          <p className="nl-food-subheading">
            Hệ số khối lượng riêng ($\rho = g/cm^3$) dùng cho thuật toán phục dựng thể tích AR Depth Map
          </p>
        </div>

        {onAddFood && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="nl-btn-add-food"
          >
            <span>+ Thêm Món Ăn Mới</span>
          </button>
        )}
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
                <div className="nl-food-card-info">
                  <span className="nl-food-emoji">{food.emoji || '🍲'}</span>
                  <div className="nl-food-title-group">
                    <span className="nl-food-name">{food.displayName || food.name}</span>
                    <span className="nl-food-code">{food.foodCode}</span>
                  </div>
                </div>

                <div className="nl-card-actions">
                  {onUpdateFood && (
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(food)}
                      className="nl-action-btn-small"
                      title="Sửa hệ số mật độ rho"
                    >
                      ✏️
                    </button>
                  )}
                  {onDeleteFood && (
                    <button
                      type="button"
                      onClick={() => onDeleteFood(food.id)}
                      className="nl-action-btn-small nl-action-btn-delete"
                      title="Xóa món"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div className="nl-food-metrics-grid">
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Calo</span>
                  <span className="nl-metric-value">{food.kcalPer100g || food.kcal} kcal</span>
                </div>
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Đạm</span>
                  <span className="nl-metric-value">{food.proteinPer100g || food.proteinG}g</span>
                </div>
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Carb</span>
                  <span className="nl-metric-value">{food.carbPer100g || food.carbsG}g</span>
                </div>
                <div className="nl-metric-item">
                  <span className="nl-metric-label">Béo</span>
                  <span className="nl-metric-value">{food.fatPer100g || food.fatG}g</span>
                </div>
              </div>

              <div className="nl-food-card-bottom">
                <div className="nl-food-density-badge">
                  Mật độ $\rho$: <strong>{food.densityGPerCm3 || food.densityGramsPerCm3 || 0.85} g/cm³</strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{food.category}</span>
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
              <th className="nl-table-th" style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.map((food) => (
              <tr key={food.id || food.foodCode} className="nl-table-row">
                <td className="nl-table-td">
                  <span style={{ marginRight: '0.5rem' }}>{food.emoji || '🍲'}</span>
                  <strong>{food.displayName || food.name}</strong>
                </td>
                <td className="nl-table-td" style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                  {food.foodCode}
                </td>
                <td className="nl-table-td">{food.category || 'Chung'}</td>
                <td className="nl-table-td" style={{ color: '#0284c7', fontWeight: 600 }}>
                  {food.densityGPerCm3 || food.densityGramsPerCm3 || 0.85} g/cm³
                </td>
                <td className="nl-table-td" style={{ fontWeight: 700 }}>
                  {food.kcalPer100g || food.kcal} kcal
                </td>
                <td className="nl-table-td">{food.proteinPer100g || food.proteinG}g</td>
                <td className="nl-table-td">{food.carbPer100g || food.carbsG}g</td>
                <td className="nl-table-td">{food.fatPer100g || food.fatG}g</td>
                <td className="nl-table-td" style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                    {onUpdateFood && (
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(food)}
                        className="nl-action-btn-small"
                      >
                        Sửa $\rho$
                      </button>
                    )}
                    {onDeleteFood && (
                      <button
                        type="button"
                        onClick={() => onDeleteFood(food.id)}
                        className="nl-action-btn-small nl-action-btn-delete"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm / Chỉnh Sửa Món Ăn & Hệ số Thể tích AR */}
      {isModalOpen && (
        <div className="nl-modal-backdrop" role="dialog" aria-modal="true">
          <div className="nl-food-modal-box">
            <div className="nl-modal-header">
              <h2 className="nl-modal-title">
                {editingFood ? 'Chỉnh Sửa Hệ Số Mật Độ Món Ăn' : 'Thêm Món Ăn Mới Vào CSDL'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="nl-modal-close-btn"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="nl-food-form-grid">
                <div className="nl-form-group">
                  <label htmlFor="foodCode" className="nl-form-label">Mã Code (Định danh duy nhất)</label>
                  <input
                    id="foodCode"
                    type="text"
                    required
                    disabled={!!editingFood}
                    placeholder="VD: VIET_PHO_GA"
                    value={formData.foodCode}
                    onChange={(e) => setFormData({ ...formData, foodCode: e.target.value })}
                    className="nl-form-input"
                  />
                </div>

                <div className="nl-form-group">
                  <label htmlFor="displayName" className="nl-form-label">Tên hiển thị</label>
                  <input
                    id="displayName"
                    type="text"
                    required
                    placeholder="VD: Phở Gà Ta Hà Nội"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="nl-form-input"
                  />
                </div>

                <div className="nl-form-group">
                  <label htmlFor="category" className="nl-form-label">Phân loại bữa ăn</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="nl-form-select"
                  >
                    <option value="Breakfast">Bữa sáng (Breakfast)</option>
                    <option value="Lunch">Bữa trưa (Lunch)</option>
                    <option value="Dinner">Bữa tối (Dinner)</option>
                    <option value="Salad">Salad / Khai vị</option>
                    <option value="Snack">Ăn nhẹ / Snack</option>
                  </select>
                </div>

                <div className="nl-form-group">
                  <label htmlFor="density" className="nl-form-label">
                    Mật độ thể tích $\rho$ (g/cm³) ⭐
                  </label>
                  <input
                    id="density"
                    type="number"
                    step="0.01"
                    min="0.10"
                    max="3.00"
                    required
                    value={formData.densityGramsPerCm3}
                    onChange={(e) => setFormData({ ...formData, densityGramsPerCm3: e.target.value })}
                    className="nl-form-input"
                  />
                </div>

                <div className="nl-form-group">
                  <label htmlFor="kcal" className="nl-form-label">Năng lượng (kcal/100g)</label>
                  <input
                    id="kcal"
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.kcalPer100g}
                    onChange={(e) => setFormData({ ...formData, kcalPer100g: e.target.value })}
                    className="nl-form-input"
                  />
                </div>

                <div className="nl-form-group">
                  <label htmlFor="protein" className="nl-form-label">Chất đạm (g/100g)</label>
                  <input
                    id="protein"
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.proteinPer100g}
                    onChange={(e) => setFormData({ ...formData, proteinPer100g: e.target.value })}
                    className="nl-form-input"
                  />
                </div>

                <div className="nl-form-group">
                  <label htmlFor="carb" className="nl-form-label">Chất đường bột (g/100g)</label>
                  <input
                    id="carb"
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.carbPer100g}
                    onChange={(e) => setFormData({ ...formData, carbPer100g: e.target.value })}
                    className="nl-form-input"
                  />
                </div>

                <div className="nl-form-group">
                  <label htmlFor="fat" className="nl-form-label">Chất béo (g/100g)</label>
                  <input
                    id="fat"
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.fatPer100g}
                    onChange={(e) => setFormData({ ...formData, fatPer100g: e.target.value })}
                    className="nl-form-input"
                  />
                </div>
              </div>

              <div className="nl-form-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="nl-btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="nl-btn-primary"
                >
                  {editingFood ? 'Lưu Thay Đổi' : 'Tạo Món Ăn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
