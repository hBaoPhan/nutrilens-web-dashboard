import React, { useState } from 'react';
import './NutritionTipsTab.css';

export const NutritionTipsTab = ({ tips = [], onAddTip, onDeleteTip }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('NUTRITION');
  const [targetGoal, setTargetGoal] = useState('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddTip({
        title: title.trim(),
        content: content.trim(),
        category,
        targetGoal
      });
      setTitle('');
      setContent('');
      setShowForm(false);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu lời khuyên');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nl-tips-container">
      <div className="nl-tips-header-row">
        <div>
          <h1 className="nl-tips-heading">Quản Lý Lời Khuyên Dinh Dưỡng</h1>
          <p className="nl-tips-subheading">
            Cung cấp kiến thức ăn uống lành mạnh tự động hiển thị cho người dùng ứng dụng
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="nl-add-tip-btn"
        >
          <span>{showForm ? '✕ Đóng form' : '+ Tạo Lời Khuyên Mới'}</span>
        </button>
      </div>

      {/* Add Tip Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="nl-tip-form-card">
          <h2 className="nl-form-title">Tạo lời khuyên dinh dưỡng mới</h2>
          
          <div className="nl-form-grid">
            <div className="nl-form-group">
              <label htmlFor="tip-title" className="nl-form-label">Tiêu đề lời khuyên</label>
              <input
                id="tip-title"
                type="text"
                required
                placeholder="VD: Uống đủ nước trước bữa trưa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="nl-form-input"
              />
            </div>

            <div className="nl-form-group">
              <label htmlFor="tip-goal" className="nl-form-label">Mục tiêu hướng tới</label>
              <select
                id="tip-goal"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="nl-form-select"
              >
                <option value="GENERAL">Chung (Mọi đối tượng)</option>
                <option value="LOSE_WEIGHT">Giảm mỡ / Giảm cân</option>
                <option value="GAIN_MUSCLE">Tăng cơ / Tập gym</option>
                <option value="MAINTAIN">Duy trì thể trạng</option>
              </select>
            </div>
          </div>

          <div className="nl-form-group">
            <label htmlFor="tip-content" className="nl-form-label">Nội dung chi tiết</label>
            <textarea
              id="tip-content"
              required
              rows={3}
              placeholder="Nhập nội dung hướng dẫn dinh dưỡng..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="nl-form-textarea"
            />
          </div>

          <div className="nl-form-actions">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="nl-btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="nl-btn-primary"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu Lời Khuyên'}
            </button>
          </div>
        </form>
      )}

      {/* Tips List */}
      <div className="nl-tips-grid">
        {tips.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '2rem' }}>
            Chưa có lời khuyên dinh dưỡng nào được thiết lập
          </p>
        ) : (
          tips.map((tip) => (
            <article key={tip.id} className="nl-tip-card">
              <div className="nl-tip-content-group">
                <div className="nl-tip-badge-row">
                  <span className="nl-tip-goal-tag">
                    {tip.targetGoal || 'GENERAL'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {tip.category || 'NUTRITION'}
                  </span>
                </div>
                <h3 className="nl-tip-title">{tip.title}</h3>
                <p className="nl-tip-body">{tip.content}</p>
              </div>

              {onDeleteTip && (
                <button
                  type="button"
                  onClick={() => onDeleteTip(tip.id)}
                  className="nl-tip-delete-btn"
                >
                  Xóa bỏ
                </button>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};
