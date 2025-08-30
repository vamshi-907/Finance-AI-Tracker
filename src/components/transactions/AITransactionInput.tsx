import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTransactions } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { ParsedTransaction } from '@/types';

export default function AITransactionInput() {
  const [input, setInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null);
  const [adding, setAdding] = useState(false);
  
  const { parseTransaction, addTransaction } = useTransactions();
  const { toast } = useToast();

  const handleParse = async () => {
    if (!input.trim()) return;
    
    setParsing(true);
    try {
      const result = await parseTransaction(input);
      setParsedData(result);
      
      toast({
        title: "Transaction Parsed Successfully",
        description: `AI extracted: $${result.amount} for ${result.category}`,
      });
    } catch (error) {
      toast({
        title: "Parsing Failed",
        description: "Please try again or enter manually",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!parsedData) return;
    
    setAdding(true);
    try {
      await addTransaction({
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description,
        date: new Date().toISOString().split('T')[0],
        type: parsedData.type,
      });

      toast({
        title: "Transaction Added",
        description: `Successfully added ${parsedData.type} of $${parsedData.amount}`,
      });

      // Reset form
      setInput('');
      setParsedData(null);
    } catch (error) {
      toast({
        title: "Failed to Add Transaction",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-income text-white';
    if (confidence >= 0.6) return 'bg-warning text-white';
    return 'bg-expense text-white';
  };

  const exampleInputs = [
    "Coffee at Starbucks $6.50",
    "Got paid $3500 salary today",
    "Spent 45 dollars on gas at Shell",
    "Ordered Panda Express for $25"
  ];

  return (
    <Card className="card-financial">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Transaction Parser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Describe your transaction in natural language..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleParse()}
              className="flex-1"
            />
            <Button 
              onClick={handleParse} 
              disabled={!input.trim() || parsing}
              className="btn-financial"
            >
              {parsing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              Parse
            </Button>
          </div>

          {/* Example inputs */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleInputs.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setInput(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Parsed Result */}
        {parsedData && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-income" />
                <span className="text-sm font-medium">AI Parsed Result</span>
                <Badge className={getConfidenceColor(parsedData.confidence)}>
                  {Math.round(parsedData.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">
                    ${parsedData.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant={parsedData.type === 'income' ? 'default' : 'secondary'}>
                    {parsedData.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">{parsedData.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="font-medium truncate">{parsedData.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddTransaction}
                  disabled={adding}
                  className="btn-financial flex-1"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Transaction
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedData(null);
                    setInput('');
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </>
        )}

        {parsedData?.confidence && parsedData.confidence < 0.7 && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Low Confidence Detection</p>
              <p className="text-muted-foreground">
                Please review the parsed data before adding to ensure accuracy.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}