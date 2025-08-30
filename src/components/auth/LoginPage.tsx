import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, PieChart, Brain } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      await login(credentialResponse.credential);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left text-white space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Finance AI
              <span className="text-primary-light block">Tracker</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-lg mx-auto lg:mx-0">
              Transform your financial habits with AI-powered insights and smart transaction tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 text-white/90">
              <Brain className="h-6 w-6 text-primary-light" />
              <span>AI Transaction Parsing</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <TrendingUp className="h-6 w-6 text-primary-light" />
              <span>Smart Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <PieChart className="h-6 w-6 text-primary-light" />
              <span>Visual Insights</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Sparkles className="h-6 w-6 text-primary-light" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md mx-auto animate-scale-in">
          <Card className="card-financial border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to continue your financial journey
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error('Login failed')}
                  size="large"
                  theme="outline"
                  text="signin_with"
                  width="100%"
                />
                
                {loading && (
                  <div className="text-center text-muted-foreground">
                    <div className="shimmer h-2 w-full rounded"></div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Demo Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI-powered transaction parsing</li>
                  <li>• Real-time expense tracking</li>
                  <li>• Interactive charts & analytics</li>
                  <li>• Category-based insights</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}