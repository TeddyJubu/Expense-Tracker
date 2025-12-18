import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/template';
import { expenseService, categoryService, budgetService } from '@/services/database';
import { defaultCategories } from '@/constants/categories';
import type { Expense, Category, Budget } from '@/services/database';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setCategories([]);
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [expensesRes, categoriesRes, budgetsRes] = await Promise.all([
        expenseService.getExpenses(user.id),
        categoryService.getCategories(user.id),
        budgetService.getBudgets(user.id),
      ]);

      if (expensesRes.data) setExpenses(expensesRes.data);
      
      if (categoriesRes.data) {
        if (categoriesRes.data.length === 0) {
          const newCategories: Category[] = [];
          for (const cat of defaultCategories) {
            const { data } = await categoryService.createCategory({
              user_id: user.id,
              ...cat,
            });
            if (data) newCategories.push(data);
          }
          setCategories(newCategories);
        } else {
          setCategories(categoriesRes.data);
        }
      }
      
      if (budgetsRes.data) setBudgets(budgetsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;
    
    const { data, error } = await expenseService.createExpense({
      ...expense,
      user_id: user.id,
    });

    if (data && !error) {
      setExpenses(prev => [data, ...prev]);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const { error } = await expenseService.updateExpense(id, updates);
    if (!error) {
      setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await expenseService.deleteExpense(id);
    if (!error) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;
    
    const { data, error } = await budgetService.createBudget({
      ...budget,
      user_id: user.id,
    });

    if (data && !error) {
      setBudgets(prev => [...prev, data]);
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    const { error } = await budgetService.updateBudget(id, updates);
    if (!error) {
      setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        budgets,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        refreshData: loadData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
