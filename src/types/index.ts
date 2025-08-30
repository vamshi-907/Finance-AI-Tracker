export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedTransaction {
  amount: number;
  category: string;
  description: string;
  confidence: number;
  type: 'income' | 'expense';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TrendData {
  date: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const CATEGORIES = [
  'Food & Drinks',
  'Shopping',
  'Transport',
  'Entertainment',
  'Groceries',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Income',
  'Side Income',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];