import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import LoginPage from "./components/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <TransactionProvider>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </TransactionProvider>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <TransactionProvider>
                  <DashboardLayout>
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold">Transactions Page</h2>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </TransactionProvider>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <TransactionProvider>
                  <DashboardLayout>
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold">Analytics Page</h2>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </TransactionProvider>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <TransactionProvider>
                  <DashboardLayout>
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold">Settings Page</h2>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </TransactionProvider>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
