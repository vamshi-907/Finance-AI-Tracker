import { useState, useMemo } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Share2,
  Target,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';

export default function AnalyticsPage() {
  const { transactions, summary, categoryData, trendData } = useTransactions();
  const [timeRange, setTimeRange] = useState('30d');
  const [viewType, setViewType] = useState('overview');

  // Calculate additional analytics
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income: 0,
        expenses: 0,
        savings: 0
      };
    });

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = months.findIndex(month => {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - (5 - months.indexOf(month)));
        return transactionDate.getMonth() === monthDate.getMonth() && 
               transactionDate.getFullYear() === monthDate.getFullYear();
      });

      if (monthIndex !== -1) {
        if (transaction.type === 'income') {
          months[monthIndex].income += transaction.amount;
        } else {
          months[monthIndex].expenses += transaction.amount;
        }
        months[monthIndex].savings = months[monthIndex].income - months[monthIndex].expenses;
      }
    });

    return months;
  }, [transactions]);

  const categoryTrends = useMemo(() => {
    const categories = new Map();
    
    transactions.filter(t => t.type === 'expense').forEach(transaction => {
      if (!categories.has(transaction.category)) {
        categories.set(transaction.category, {
          name: transaction.category,
          current: 0,
          previous: 0,
          change: 0
        });
      }
      categories.get(transaction.category).current += transaction.amount;
    });

    return Array.from(categories.values()).map(cat => ({
      ...cat,
      change: Math.random() * 20 - 10 // Mock change percentage
    }));
  }, [transactions]);

  const budgetData = [
    { category: 'Food & Drinks', budget: 500, spent: 156.5, percentage: 31.3 },
    { category: 'Transport', budget: 300, spent: 57, percentage: 19 },
    { category: 'Entertainment', budget: 200, spent: 15.99, percentage: 8 },
    { category: 'Groceries', budget: 400, spent: 120, percentage: 30 },
    { category: 'Shopping', budget: 250, spent: 0, percentage: 0 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderCustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{props.label}</p>
          {props.payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Amount') || entry.name.includes('income') || entry.name.includes('expenses') || entry.name.includes('savings') 
                ? formatCurrency(entry.value) 
                : `$${entry.value?.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into your financial patterns and trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-financial">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Daily Spending</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.totalExpenses / 30)}
                </p>
              </div>
              <div className="p-2 bg-expense/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-expense" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-income">↗ 12%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-bold">
                  {summary.totalIncome > 0 ? Math.round((summary.savings / summary.totalIncome) * 100) : 0}%
                </p>
              </div>
              <div className="p-2 bg-savings/10 rounded-lg">
                <Target className="h-5 w-5 text-savings" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-income">↗ 5%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Category</p>
                <p className="text-2xl font-bold">
                  {categoryData[0]?.name || 'N/A'}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <PieChartIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-muted-foreground">
                {categoryData[0] ? formatCurrency(categoryData[0].amount) : '$0'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-income">↗ 8</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card className="card-financial">
              <CardHeader>
                <CardTitle>6-Month Financial Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--income))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--income))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--expense))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--expense))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} />
                      <Tooltip content={renderCustomTooltip} />
                      <Area type="monotone" dataKey="income" stroke="hsl(var(--income))" fill="url(#incomeGradient)" />
                      <Area type="monotone" dataKey="expenses" stroke="hsl(var(--expense))" fill="url(#expenseGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="card-financial">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={renderCustomTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categoryData.slice(0, 6).map((category) => (
                    <div key={category.name} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="truncate">{category.name}</span>
                      <span className="font-medium ml-auto">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Comparison */}
            <Card className="card-financial">
              <CardHeader>
                <CardTitle>Category Spending Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={formatCurrency} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip content={renderCustomTooltip} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Trends */}
            <Card className="card-financial">
              <CardHeader>
                <CardTitle>Category Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTrends.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(category.current)} this period
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.change > 0 ? "destructive" : "default"}>
                          {category.change > 0 ? '↗' : '↘'} {Math.abs(category.change).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="card-financial">
            <CardHeader>
              <CardTitle>Daily Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip content={renderCustomTooltip} />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(var(--expense))" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="hsl(var(--income))" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Card className="card-financial">
            <CardHeader>
              <CardTitle>Budget vs Actual Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetData.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className={item.percentage > 80 ? 'text-expense' : 'text-muted-foreground'}>
                        {item.percentage.toFixed(1)}% used
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(item.budget - item.spent)} remaining
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}