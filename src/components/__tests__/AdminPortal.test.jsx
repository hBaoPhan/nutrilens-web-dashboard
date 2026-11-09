import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverviewTab } from '../OverviewTab';
import { FoodDatabaseTab } from '../FoodDatabaseTab';
import { NutritionTipsTab } from '../NutritionTipsTab';

const mockFoods = [
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
  }
];

const mockMealLogs = [
  { id: 1, totalKcal: 600.0, mealType: 'LUNCH' },
  { id: 2, totalKcal: 400.0, mealType: 'DINNER' }
];

const mockTips = [
  { id: 1, title: 'Uống nước', content: 'Uống đủ 2L nước', category: 'HYDRATION', targetGoal: 'GENERAL' }
];

describe('Admin Portal Components', () => {
  it('renders OverviewTab and calculates average calories accurately', () => {
    render(<OverviewTab foods={mockFoods} mealLogs={mockMealLogs} tips={mockTips} onNavigateTab={() => {}} />);
    
    // Average of 600 and 400 is 500
    expect(screen.getByText('500')).toBeDefined();
    // Microservice status
    expect(screen.getByText('Spring Boot Backend Core')).toBeDefined();
    expect(screen.getByText('FastAPI YOLOv8-seg Service')).toBeDefined();
  });

  it('filters food database when searching food name in FoodDatabaseTab', () => {
    render(<FoodDatabaseTab foods={mockFoods} />);

    // Since both mobile card and desktop table are rendered in DOM for responsive CSS
    expect(screen.getAllByText('Cơm Tấm Sườn Bì Chả').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Phở Bò Tái Nạm').length).toBeGreaterThan(0);

    const searchInput = screen.getByPlaceholderText('Tìm theo tên món ăn hoặc mã món...');
    fireEvent.change(searchInput, { target: { value: 'Phở' } });

    expect(screen.getAllByText('Phở Bò Tái Nạm').length).toBeGreaterThan(0);
    expect(screen.queryByText('Cơm Tấm Sườn Bì Chả')).toBeNull();
  });

  it('renders NutritionTipsTab and toggles add tip form', () => {
    render(<NutritionTipsTab tips={mockTips} onAddTip={() => {}} onDeleteTip={() => {}} />);

    expect(screen.getByText('Uống nước')).toBeDefined();
    expect(screen.getByText('Uống đủ 2L nước')).toBeDefined();

    const toggleBtn = screen.getByRole('button', { name: /\+ Tạo Lời Khuyên Mới/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText('Tạo lời khuyên dinh dưỡng mới')).toBeDefined();
  });
});
