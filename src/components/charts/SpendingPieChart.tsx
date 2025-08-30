import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/contexts/TransactionContext';

export default function SpendingPieChart() {
  const { categoryData } = useTransactions();

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">
            ${data.amount.toFixed(2)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    return entry.percentage > 5 ? `${entry.percentage.toFixed(0)}%` : '';
  };

  return (
    <Card className="card-financial">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                animationDuration={1000}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {categoryData.slice(0, 6).map((category, index) => (
            <div key={category.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="text-muted-foreground truncate">
                {category.name}
              </span>
              <span className="font-medium ml-auto">
                ${category.amount.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}