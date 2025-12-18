import { colors } from './theme';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'Food', color: colors.categoryFood, icon: 'restaurant' },
  { name: 'Transport', color: colors.categoryTransport, icon: 'car' },
  { name: 'Shopping', color: colors.categoryShopping, icon: 'shopping-bag' },
  { name: 'Entertainment', color: colors.categoryEntertainment, icon: 'film' },
  { name: 'Bills', color: colors.categoryBills, icon: 'receipt' },
  { name: 'Health', color: colors.categoryHealth, icon: 'medical' },
  { name: 'Other', color: colors.categoryOther, icon: 'ellipsis-horizontal' },
];
