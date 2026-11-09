import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealLogDashboard } from '../MealLogDashboard';

const mockMeals = [
  {
    id: 1,
    mealType: 'LUNCH',
    loggedAt: '12:30 PM',
    foodName: 'Cơm Tấm Sườn Bì Chả',
    totalKcal: 650.0,
    totalWeightG: 420.0,
    userNotes: 'Bữa trưa <b>rất ngon</b>!<script>alert("XSS_ATTACK")</script><img src="x" onerror="alert(\'HACK\')">'
  },
  {
    id: 2,
    mealType: 'DINNER',
    loggedAt: '07:15 PM',
    foodName: 'Phở Bò Tái Nạm',
    totalKcal: 480.0,
    totalWeightG: 550.0,
    userNotes: 'Ít bánh phở, nhiều rau.'
  }
];

describe('MealLogDashboard Component', () => {
  it('renders meal list and selects the first meal by default', () => {
    render(<MealLogDashboard initialData={mockMeals} userId={1} />);

    expect(screen.getByText('Cơm Tấm Sườn Bì Chả')).toBeDefined();
    expect(screen.getByTestId('kcal-1').textContent).toContain('650 kcal');
    expect(screen.getByTestId('adjusted-kcal').textContent).toBe('650.0 kcal');
  });

  it('updates adjusted calories in real-time when portion slider is changed', () => {
    render(<MealLogDashboard initialData={mockMeals} userId={1} />);

    const slider = screen.getByTestId('portion-slider');
    // Change portion from 100% to 50%
    fireEvent.change(slider, { target: { value: '0.50' } });

    // Adjusted kcal should now be 650 * 0.5 = 325.0 kcal
    expect(screen.getByTestId('adjusted-kcal').textContent).toBe('325.0 kcal');
  });

  it('strictly sanitizes XSS injection in userNotes via DOMPurify', () => {
    render(<MealLogDashboard initialData={mockMeals} userId={1} />);

    const notesContainer = screen.getByTestId('user-notes-display');
    
    // Valid HTML (<b> tag) should be preserved
    expect(notesContainer.innerHTML).toContain('<b>rất ngon</b>');
    
    // Malicious script tag must be completely eliminated
    expect(notesContainer.innerHTML).not.toContain('<script>');
    expect(notesContainer.innerHTML).not.toContain('alert("XSS_ATTACK")');
    
    // Malicious onerror handler must be stripped
    expect(notesContainer.innerHTML).not.toContain('onerror');
  });

  it('switches active meal selection upon clicking another meal card', () => {
    render(<MealLogDashboard initialData={mockMeals} userId={1} />);

    const secondMealBtn = screen.getByTestId('kcal-2').closest('button');
    fireEvent.click(secondMealBtn);

    expect(screen.getByText('Phở Bò Tái Nạm')).toBeDefined();
    expect(screen.getByTestId('adjusted-kcal').textContent).toBe('480.0 kcal');
  });
});
