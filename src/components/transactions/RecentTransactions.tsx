import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/contexts/TransactionContext';
import { MoreHorizontal, Eye, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction } from '@/types';

export default function RecentTransactions() {
  const { transactions, deleteTransaction } = useTransactions();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Get recent transactions (last 10)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Drinks': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Transport': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Groceries': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Income': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Side Income': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (recentTransactions.length === 0) {
    return (
      <Card className="card-financial">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use the AI parser above to add your first transaction
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-financial">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-income/10 text-income' 
                    : 'bg-expense/10 text-expense'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-income' : 'text-expense'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deletingId === transaction.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deletingId === transaction.id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}