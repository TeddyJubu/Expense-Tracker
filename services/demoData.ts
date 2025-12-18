import { expenseService, categoryService } from './database';

const DEMO_CATEGORIES = [
  { name: 'Food', color: '#f97316', icon: 'restaurant' },
  { name: 'Transport', color: '#06b6d4', icon: 'car' },
  { name: 'Shopping', color: '#ec4899', icon: 'bag' },
  { name: 'Entertainment', color: '#a855f7', icon: 'film' },
  { name: 'Bills', color: '#eab308', icon: 'document' },
  { name: 'Health', color: '#10b981', icon: 'medical' },
];

const DEMO_EXPENSES = [
  { description: 'Coffee at Starbucks', amount: 5.50, category: 'Food', daysAgo: 0 },
  { description: 'Lunch with friends', amount: 25.00, category: 'Food', daysAgo: 1 },
  { description: 'Uber to office', amount: 12.50, category: 'Transport', daysAgo: 1 },
  { description: 'Netflix subscription', amount: 15.99, category: 'Entertainment', daysAgo: 2 },
  { description: 'Grocery shopping', amount: 85.30, category: 'Shopping', daysAgo: 2 },
  { description: 'Gas station', amount: 45.00, category: 'Transport', daysAgo: 3 },
  { description: 'Movie tickets', amount: 28.00, category: 'Entertainment', daysAgo: 3 },
  { description: 'Pharmacy', amount: 32.50, category: 'Health', daysAgo: 4 },
  { description: 'Dinner at restaurant', amount: 65.00, category: 'Food', daysAgo: 4 },
  { description: 'Electricity bill', amount: 120.00, category: 'Bills', daysAgo: 5 },
  { description: 'Gym membership', amount: 50.00, category: 'Health', daysAgo: 5 },
  { description: 'Online shopping', amount: 95.00, category: 'Shopping', daysAgo: 6 },
];

export const demoDataService = {
  async seedDemoData(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Create categories
      const categoryMap: { [key: string]: string } = {};
      for (const cat of DEMO_CATEGORIES) {
        const { data, error } = await categoryService.createCategory({
          user_id: userId,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
        });
        if (error) throw new Error(error);
        if (data) categoryMap[cat.name] = data.id;
      }

      // Create expenses
      for (const exp of DEMO_EXPENSES) {
        const date = new Date();
        date.setDate(date.getDate() - exp.daysAgo);
        
        const { error } = await expenseService.createExpense({
          user_id: userId,
          amount: exp.amount,
          category_id: categoryMap[exp.category] || null,
          description: exp.description,
          date: date.toISOString().split('T')[0],
          input_method: 'manual',
          photo_url: null,
        });
        if (error) throw new Error(error);
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

