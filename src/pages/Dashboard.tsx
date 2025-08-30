import { useTransactions } from '@/contexts/TransactionContext';
import FinancialSummaryCards from '@/components/dashboard/FinancialSummaryCards';
import SpendingPieChart from '@/components/charts/SpendingPieChart';
import TrendChart from '@/components/charts/TrendChart';
import AITransactionInput from '@/components/transactions/AITransactionInput';
import RecentTransactions from '@/components/transactions/RecentTransactions';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { loading, refreshData } = useTransactions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <FinancialSummaryCards />

      {/* AI Transaction Input */}
      <AITransactionInput />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart />
        <SpendingPieChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}