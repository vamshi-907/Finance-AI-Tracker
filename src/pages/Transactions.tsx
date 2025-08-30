import { useState, useMemo } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  CalendarIcon,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction, CATEGORIES } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AITransactionInput from '@/components/transactions/AITransactionInput';

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } = useTransactions();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Form state for add/edit transaction
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    type: 'expense' as 'income' | 'expense'
  });

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, categoryFilter, typeFilter, sortBy]);

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date(),
      type: 'expense'
    });
    setEditingTransaction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const transactionData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: format(formData.date, 'yyyy-MM-dd'),
        type: formData.type
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
        toast({
          title: "Transaction Updated",
          description: "Your transaction has been updated successfully.",
        });
      } else {
        await addTransaction(transactionData);
        toast({
          title: "Transaction Added",
          description: "Your transaction has been added successfully.",
        });
      }

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date),
      type: transaction.type
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM dd, yyyy');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track all your financial transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-financial" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter transaction description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && setFormData({ ...formData, date })}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-financial">
                    {editingTransaction ? 'Update' : 'Add'} Transaction
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Transaction Input */}
      <AITransactionInput />

      {/* Filters and Search */}
      <Card className="card-financial">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="card-financial">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            All Transactions ({filteredAndSortedTransactions.length})
          </CardTitle>
          <Button variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {filteredAndSortedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' 
                  ? 'No transactions match your filters'
                  : 'No transactions yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4">
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{transaction.description}</p>
                        <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                          {transaction.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${
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
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}