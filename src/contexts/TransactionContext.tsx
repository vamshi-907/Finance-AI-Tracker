import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, ParsedTransaction, FinancialSummary, CategoryData, TrendData } from '@/types';
import { useAuth } from './AuthContext';

interface TransactionContextType {
  transactions: Transaction[];
  summary: FinancialSummary;
  categoryData: CategoryData[];
  trendData: TrendData[];
  loading: boolean;
  parseTransaction: (text: string) => Promise<ParsedTransaction>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Mock seed data for demo
const SEED_TRANSACTIONS: Omit<Transaction, 'userId' | 'id'>[] = [
  {
    amount: 3500,
    category: 'Income',
    description: 'Monthly Salary',
    date: '2025-08-01',
    type: 'income',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-08-01T09:00:00Z'
  },
  {
    amount: 6.5,
    category: 'Food & Drinks',
    description: 'Coffee at Starbucks',
    date: '2025-08-02',
    type: 'expense',
    createdAt: '2025-08-02T08:30:00Z',
    updatedAt: '2025-08-02T08:30:00Z'
  },
  {
    amount: 12,
    category: 'Transport',
    description: 'Uber ride',
    date: '2025-08-03',
    type: 'expense',
    createdAt: '2025-08-03T14:15:00Z',
    updatedAt: '2025-08-03T14:15:00Z'
  },
  {
    amount: 15.99,
    category: 'Entertainment',
    description: 'Netflix subscription',
    date: '2025-08-04',
    type: 'expense',
    createdAt: '2025-08-04T10:00:00Z',
    updatedAt: '2025-08-04T10:00:00Z'
  },
  {
    amount: 120,
    category: 'Groceries',
    description: 'Grocery shopping at Walmart',
    date: '2025-08-05',
    type: 'expense',
    createdAt: '2025-08-05T16:45:00Z',
    updatedAt: '2025-08-05T16:45:00Z'
  },
  {
    amount: 45,
    category: 'Transport',
    description: 'Gas at Shell',
    date: '2025-08-06',
    type: 'expense',
    createdAt: '2025-08-06T12:30:00Z',
    updatedAt: '2025-08-06T12:30:00Z'
  },
  {
    amount: 500,
    category: 'Side Income',
    description: 'Freelance payment',
    date: '2025-08-07',
    type: 'income',
    createdAt: '2025-08-07T17:00:00Z',
    updatedAt: '2025-08-07T17:00:00Z'
  }
];

// Mock AI parsing function
const mockParseTransaction = async (text: string): Promise<ParsedTransaction> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerText = text.toLowerCase();
  
  // Extract amount
  const amountMatch = text.match(/[\$]?(\d+(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  
  // Determine type and category
  let type: 'income' | 'expense' = 'expense';
  let category = 'Other';
  
  if (lowerText.includes('salary') || lowerText.includes('paid') || lowerText.includes('income')) {
    type = 'income';
    category = 'Income';
  } else if (lowerText.includes('coffee') || lowerText.includes('starbucks') || lowerText.includes('restaurant') || lowerText.includes('food')) {
    category = 'Food & Drinks';
  } else if (lowerText.includes('gas') || lowerText.includes('uber') || lowerText.includes('transport')) {
    category = 'Transport';
  } else if (lowerText.includes('grocery') || lowerText.includes('walmart') || lowerText.includes('supermarket')) {
    category = 'Groceries';
  } else if (lowerText.includes('netflix') || lowerText.includes('entertainment') || lowerText.includes('movie')) {
    category = 'Entertainment';
  }
  
  return {
    amount,
    category,
    description: text.replace(/[\$\d\.]+/g, '').trim(),
    confidence: 0.85,
    type
  };
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with seed data for demo
  useEffect(() => {
    if (user) {
      const userKey = `transactions_${user.id}`;
      const saved = localStorage.getItem(userKey);
      
      if (saved) {
        setTransactions(JSON.parse(saved));
      } else {
        // First time user - add seed data
        const seedTransactions = SEED_TRANSACTIONS.map((t, index) => ({
          ...t,
          id: `seed_${index}`,
          userId: user.id
        }));
        setTransactions(seedTransactions);
        localStorage.setItem(userKey, JSON.stringify(seedTransactions));
      }
    }
  }, [user]);

  const saveTransactions = (newTransactions: Transaction[]) => {
    if (user) {
      const userKey = `transactions_${user.id}`;
      localStorage.setItem(userKey, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    }
  };

  const parseTransaction = async (text: string): Promise<ParsedTransaction> => {
    return mockParseTransaction(text);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newTransactions = [...transactions, newTransaction];
    saveTransactions(newTransactions);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const newTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    saveTransactions(newTransactions);
  };

  const deleteTransaction = async (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    saveTransactions(newTransactions);
  };

  const refreshData = async () => {
    // In a real app, this would fetch from the server
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  // Calculate summary
  const summary: FinancialSummary = React.useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      savings: income - expenses,
      monthlyIncome: income,
      monthlyExpenses: expenses
    };
  }, [transactions]);

  // Calculate category data
  const categoryData: CategoryData[] = React.useMemo(() => {
    const categories = new Map<string, number>();
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(t => {
      categories.set(t.category, (categories.get(t.category) || 0) + t.amount);
    });

    const total = Array.from(categories.values()).reduce((sum, amount) => sum + amount, 0);
    
    const colors = ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(261, 83%, 58%)', 'hsl(326, 78%, 68%)'];
    
    return Array.from(categories.entries()).map(([name, amount], index) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: colors[index % colors.length]
    }));
  }, [transactions]);

  // Calculate trend data
  const trendData: TrendData[] = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date,
        income,
        expenses,
        savings: income - expenses
      };
    });
  }, [transactions]);

  const value = {
    transactions,
    summary,
    categoryData,
    trendData,
    loading,
    parseTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};