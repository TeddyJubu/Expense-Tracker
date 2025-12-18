import { getSupabaseClient } from '@/template';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category_id: string | null;
  description: string | null;
  date: string;
  input_method: 'manual' | 'chat' | 'voice' | 'photo';
  photo_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  created_at: string;
}

const supabase = getSupabaseClient();

export const expenseService = {
  async getExpenses(userId: string): Promise<{ data: Expense[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<{ data: Expense | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expense)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async deleteExpense(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

export const categoryService = {
  async getCategories(userId: string): Promise<{ data: Category[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<{ data: Category | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

export const budgetService = {
  async getBudgets(userId: string): Promise<{ data: Budget[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createBudget(budget: Omit<Budget, 'id' | 'created_at'>): Promise<{ data: Budget | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert(budget)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateBudget(id: string, updates: Partial<Budget>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
