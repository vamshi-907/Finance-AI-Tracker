import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/contexts/TransactionContext';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FinancialSummaryCards() {
  const { summary } = useTransactions();

  const cards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      trend: '+12.5%',
      trendUp: true,
      bgClass: 'bg-income/10',
      iconClass: 'text-income',
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      trend: '+8.2%',
      trendUp: false,
      bgClass: 'bg-expense/10',
      iconClass: 'text-expense',
    },
    {
      title: 'Net Savings',
      value: summary.savings,
      icon: PiggyBank,
      trend: '+24.8%',
      trendUp: true,
      bgClass: 'bg-savings/10',
      iconClass: 'text-savings',
    },
    {
      title: 'Monthly Budget',
      value: summary.monthlyIncome - summary.monthlyExpenses,
      icon: DollarSign,
      trend: 'On track',
      trendUp: true,
      bgClass: 'bg-primary/10',
      iconClass: 'text-primary',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {cards.map((card, index) => (
        <Card key={card.title} className="card-financial hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 rounded-lg', card.bgClass)}>
              <card.icon className={cn('h-4 w-4', card.iconClass)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {card.value < 0 && '-'}
                {formatCurrency(card.value)}
              </div>
              <div className="flex items-center text-xs">
                <span
                  className={cn(
                    'font-medium',
                    card.trendUp ? 'text-income' : 'text-expense'
                  )}
                >
                  {card.trend}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}