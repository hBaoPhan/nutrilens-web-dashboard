import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout, NAV_TABS } from './components/AdminLayout';
import { OverviewTab } from './components/OverviewTab';
import { FoodDatabaseTab } from './components/FoodDatabaseTab';
import { MealLogDashboard } from './components/MealLogDashboard';
import { NutritionTipsTab } from './components/NutritionTipsTab';
import { LoginModal } from './components/LoginModal';
import { foodApi, mealLogApi, tipsApi, authApi, adminApi, setStoredToken } from './services/api';

const sampleMealLogs = [
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

export const App = () => {
  const [activeTab, setActiveTab] = useState(NAV_TABS.OVERVIEW);
  const [foods, setFoods] = useState([]);
  const [mealLogs, setMealLogs] = useState(sampleMealLogs);
  const [tips, setTips] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load Initial System Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedFoods, fetchedLogs, fetchedTips, fetchedStats] = await Promise.all([
        foodApi.getFoods(),
        mealLogApi.getMealLogs(),
        tipsApi.getTips(),
        adminApi.getStats()
      ]);

      if (fetchedFoods && fetchedFoods.length > 0) {
        setFoods(fetchedFoods);
      }
      if (fetchedLogs && fetchedLogs.length > 0) {
        setMealLogs(fetchedLogs);
      }
      if (fetchedTips && fetchedTips.length > 0) {
        setTips(fetchedTips);
      }
      if (fetchedStats) {
        setSystemStats(fetchedStats);
      }
    } catch (err) {
      console.warn('Backend offline or loading failed, using fallback data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check existing session
  useEffect(() => {
    loadData();
    authApi.getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, [loadData]);

  // Auth Handlers
  const handleLogin = async (username, password) => {
    const authData = await authApi.login(username, password);
    setCurrentUser(authData);
    await loadData();
  };

  const handleLogout = () => {
    setStoredToken(null);
    setCurrentUser(null);
  };

  // Food Management Handlers
  const handleAddFood = async (foodData) => {
    try {
      const created = await adminApi.createFood(foodData);
      setFoods((prev) => [created, ...prev]);
    } catch {
      // Local fallback for offline demo
      const mockCreated = {
        id: Date.now(),
        foodCode: foodData.foodCode,
        displayName: foodData.displayName,
        category: foodData.category,
        densityGPerCm3: foodData.densityGramsPerCm3,
        kcalPer100g: foodData.kcalPer100g,
        proteinPer100g: foodData.proteinPer100g,
        carbPer100g: foodData.carbPer100g,
        fatPer100g: foodData.fatPer100g,
        emoji: foodData.emoji
      };
      setFoods((prev) => [mockCreated, ...prev]);
    }
  };

  const handleUpdateFood = async (id, foodData) => {
    try {
      const updated = await adminApi.updateFood(id, foodData);
      setFoods((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch {
      // Local fallback for offline demo
      setFoods((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                displayName: foodData.displayName,
                category: foodData.category,
                densityGPerCm3: foodData.densityGramsPerCm3,
                kcalPer100g: foodData.kcalPer100g,
                proteinPer100g: foodData.proteinPer100g,
                carbPer100g: foodData.carbPer100g,
                fatPer100g: foodData.fatPer100g,
                emoji: foodData.emoji
              }
            : f
        )
      );
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await adminApi.deleteFood(id);
    } catch {
      // Offline support
    }
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  // Tips Management Handlers
  const handleAddTip = async (newTipData) => {
    try {
      const created = await tipsApi.createTip(newTipData);
      setTips((prev) => [created, ...prev]);
    } catch {
      // Local fallback for offline mode
      const mockCreated = {
        id: Date.now(),
        ...newTipData
      };
      setTips((prev) => [mockCreated, ...prev]);
    }
  };

  const handleDeleteTip = async (id) => {
    try {
      await tipsApi.deleteTip(id);
    } catch {
      // Offline support
    }
    setTips((prev) => prev.filter((tip) => tip.id !== id));
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
      onOpenLogin={() => setIsLoginModalOpen(true)}
      onLogout={handleLogout}
    >
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '0.5rem', color: '#059669', fontSize: '0.8125rem' }}>
          Đang đồng bộ dữ liệu hệ thống...
        </div>
      )}

      {activeTab === NAV_TABS.OVERVIEW && (
        <OverviewTab
          foods={foods}
          mealLogs={mealLogs}
          tips={tips}
          systemStats={systemStats}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === NAV_TABS.FOODS && (
        <FoodDatabaseTab
          foods={foods}
          onAddFood={handleAddFood}
          onUpdateFood={handleUpdateFood}
          onDeleteFood={handleDeleteFood}
        />
      )}

      {activeTab === NAV_TABS.MEAL_LOGS && (
        <MealLogDashboard initialData={mealLogs} userId={1} />
      )}

      {activeTab === NAV_TABS.TIPS && (
        <NutritionTipsTab
          tips={tips}
          onAddTip={handleAddTip}
          onDeleteTip={handleDeleteTip}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLogin}
      />
    </AdminLayout>
  );
};

export default App;
