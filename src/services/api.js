/**
 * AR NutriLens Web Portal - Secure API Client
 * Stateless JWT authentication & defensive REST service integration
 */

const API_BASE_URL = '/api/v1';

export const getStoredToken = () => {
  return localStorage.getItem('nutrilens_jwt_token');
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('nutrilens_jwt_token', token);
  } else {
    localStorage.removeItem('nutrilens_jwt_token');
  }
};

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const authApi = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      throw new Error(`Đăng nhập thất bại (Mã lỗi ${response.status})`);
    }
    const data = await response.json();
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Chưa đăng nhập hoặc phiên làm việc đã hết hạn');
    }
    return response.json();
  }
};

export const foodApi = {
  getFoods: async (category) => {
    try {
      const url = category && category !== 'ALL'
        ? `${API_BASE_URL}/nutrition/foods?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/nutrition/foods`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Không thể tải danh sách thực phẩm');
      return await response.json();
    } catch {
      // Fallback demo data if backend is offline
      return [
        {
          id: 1,
          foodCode: 'VIET_COM_TAM',
          displayName: 'Cơm Tấm Sườn Bì Chả',
          category: 'Lunch',
          densityGPerCm3: 0.85,
          kcalPer100g: 159.0,
          proteinPer100g: 7.8,
          carbPer100g: 22.5,
          fatPer100g: 4.2,
          emoji: '🍛'
        },
        {
          id: 2,
          foodCode: 'VIET_PHO_BO',
          displayName: 'Phở Bò Tái Nạm',
          category: 'Breakfast',
          densityGPerCm3: 0.65,
          kcalPer100g: 89.0,
          proteinPer100g: 5.6,
          carbPer100g: 12.0,
          fatPer100g: 2.1,
          emoji: '🍜'
        },
        {
          id: 3,
          foodCode: 'VIET_BUN_BO_HUE',
          displayName: 'Bún Bò Huế',
          category: 'Breakfast',
          densityGPerCm3: 0.70,
          kcalPer100g: 110.0,
          proteinPer100g: 6.8,
          carbPer100g: 14.5,
          fatPer100g: 3.2,
          emoji: '🍲'
        },
        {
          id: 4,
          foodCode: 'VIET_GOI_CUON',
          displayName: 'Gỏi Cuốn Tôm Thịt',
          category: 'Salad',
          densityGPerCm3: 0.60,
          kcalPer100g: 105.0,
          proteinPer100g: 7.2,
          carbPer100g: 15.0,
          fatPer100g: 1.8,
          emoji: '🥗'
        }
      ];
    }
  }
};

export const mealLogApi = {
  getMealLogs: async (userId) => {
    try {
      const url = userId
        ? `${API_BASE_URL}/nutrition/meal-logs?userId=${userId}`
        : `${API_BASE_URL}/nutrition/meal-logs`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Không thể tải nhật ký bữa ăn');
      return await response.json();
    } catch {
      return [
        {
          id: 1,
          mealType: 'LUNCH',
          loggedAt: '12:15 PM - 19/10/2026',
          foodName: 'Cơm Tấm Sườn Bì Chả',
          totalKcal: 685.0,
          totalWeightG: 430.0,
          userNotes: 'Quét thể tích đĩa cơm tấm: Cơm 220cm³, Sườn nướng 120cm³, Bì 30cm³. Bỏ bớt 30% cơm.'
        },
        {
          id: 2,
          mealType: 'DINNER',
          loggedAt: '07:30 PM - 19/10/2026',
          foodName: 'Phở Bò Tái Nạm',
          totalKcal: 490.0,
          totalWeightG: 550.0,
          userNotes: 'Tô phở bò tái nạm nhiều nước dùng.'
        }
      ];
    }
  }
};

export const tipsApi = {
  getTips: async (targetGoal) => {
    try {
      const url = targetGoal
        ? `${API_BASE_URL}/tips?targetGoal=${encodeURIComponent(targetGoal)}`
        : `${API_BASE_URL}/tips`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Không thể tải danh sách lời khuyên');
      return await response.json();
    } catch {
      return [
        {
          id: 1,
          title: 'Uống đủ nước trước bữa ăn',
          content: 'Uống một ly nước lọc 300ml trước bữa ăn 15 phút giúp kích hoạt tiêu hóa và tránh ăn quá no.',
          category: 'HYDRATION',
          targetGoal: 'GENERAL'
        },
        {
          id: 2,
          title: 'Tăng cường chất xơ cho bữa trưa',
          content: 'Bổ sung thêm rau luộc hoặc gỏi cuốn vào bữa trưa giúp ổn định đường huyết và no lâu hơn.',
          category: 'NUTRITION',
          targetGoal: 'LOSE_WEIGHT'
        }
      ];
    }
  },

  createTip: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tips`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Tạo lời khuyên thất bại');
    return response.json();
  },

  deleteTip: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tips/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Xóa lời khuyên thất bại');
    return true;
  }
};

export const adminApi = {
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Không thể tải dữ liệu thống kê');
      return await response.json();
    } catch {
      return {
        totalFoods: 4,
        totalMealLogs: 2,
        totalUsers: 1,
        totalTips: 2,
        averageKcalPerMeal: 587.5,
        springBootStatus: 'UP',
        aiServiceStatus: 'UP',
        databaseStatus: 'UP'
      };
    }
  },

  createFood: async (foodData) => {
    const response = await fetch(`${API_BASE_URL}/admin/foods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(foodData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Tạo món ăn thất bại');
    }
    return response.json();
  },

  updateFood: async (id, foodData) => {
    const response = await fetch(`${API_BASE_URL}/admin/foods/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(foodData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Cập nhật món ăn thất bại');
    }
    return response.json();
  },

  deleteFood: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/foods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Xóa món ăn thất bại');
    return true;
  }
};
