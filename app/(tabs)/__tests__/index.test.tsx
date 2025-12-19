import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../index';
import { useExpense } from '@/hooks/useExpense';

// Mock the useExpense hook
jest.mock('@/hooks/useExpense', () => ({
  useExpense: jest.fn(),
}));

// Mock AddExpenseModal to avoid complex rendering
jest.mock('@/components/feature/AddExpenseModal', () => ({
  AddExpenseModal: () => null,
}));

describe('HomeScreen', () => {
  const mockExpenses = [
    {
      id: '1',
      amount: '50.00',
      description: 'Groceries',
      date: new Date().toISOString(),
      category_id: 'cat1',
    },
    {
      id: '2',
      amount: '20.00',
      description: 'Transport',
      date: new Date().toISOString(),
      category_id: 'cat2',
    },
  ];

  const mockCategories = [
    { id: 'cat1', name: 'Food' },
    { id: 'cat2', name: 'Transport' },
  ];

  beforeEach(() => {
    (useExpense as jest.Mock).mockReturnValue({
      expenses: mockExpenses,
      categories: mockCategories,
      loading: false,
      fetchExpenses: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Overview')).toBeTruthy();
    expect(getByText('Total spent this month')).toBeTruthy();
    expect(getByText('Unique txns')).toBeTruthy();
    expect(getByText('Spending Trend')).toBeTruthy();
    expect(getByText('Recent')).toBeTruthy();
  });

  it('displays transaction details', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Groceries')).toBeTruthy();
    expect(getByText('$50.00')).toBeTruthy();
    expect(getByText('Transport')).toBeTruthy();
    expect(getByText('$20.00')).toBeTruthy();
  });

  it('shows no transactions message when empty', () => {
    (useExpense as jest.Mock).mockReturnValue({
      expenses: [],
      categories: mockCategories,
      loading: false,
      fetchExpenses: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('No transactions yet.')).toBeTruthy();
  });
});