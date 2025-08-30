import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/contexts/TransactionContext';

export default function TrendChart() {
  const { trendData } = useTransactions();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{formatDate(data.date)}</p>
          <div className="space-y-1">
            <p className="text-income">Income: ${data.income.toFixed(2)}</p>
            <p className="text-expense">Expenses: ${data.expenses.toFixed(2)}</p>
            <p className="text-savings">Net: ${data.savings.toFixed(2)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Prepare data with formatted dates
  const chartData = trendData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  return (
    <Card className="card-financial">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Income vs Expenses Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
              <XAxis 
                dataKey="formattedDate" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={renderTooltip} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="hsl(var(--income))"
                fillOpacity={1}
                fill="url(#incomeGradient)"
                strokeWidth={2}
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--expense))"
                fillOpacity={1}
                fill="url(#expenseGradient)"
                strokeWidth={2}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-income rounded-full"></div>
            <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-expense rounded-full"></div>
            <span>Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}