import React, { useState } from 'react';
import './LoginModal.css';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      await onLoginSuccess(username.trim(), password);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nl-modal-backdrop" role="dialog" aria-modal="true">
      <div className="nl-modal-box">
        <div className="nl-modal-header">
          <h2 className="nl-modal-title">Đăng Nhập Quản Trị Viên</h2>
          <button
            type="button"
            onClick={onClose}
            className="nl-modal-close-btn"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="nl-modal-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="nl-login-form">
          <div className="nl-form-group">
            <label htmlFor="login-username" className="nl-form-label">Tài khoản</label>
            <input
              id="login-username"
              type="text"
              required
              autoFocus
              placeholder="VD: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="nl-form-input"
            />
          </div>

          <div className="nl-form-group">
            <label htmlFor="login-password" className="nl-form-label">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="nl-form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="nl-login-submit-btn"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
};
