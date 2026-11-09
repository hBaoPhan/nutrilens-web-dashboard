import React from 'react';
import { MealLogDashboard } from './components/MealLogDashboard';

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
  return <MealLogDashboard initialData={sampleMealLogs} userId={1} />;
};

export default App;
