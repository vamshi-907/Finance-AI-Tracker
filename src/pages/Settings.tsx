import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun,
  CreditCard,
  Target,
  Settings as SettingsIcon,
  Database,
  FileText,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklyReports: true,
    budgetAlerts: true,
    transactionReminders: false,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    profileVisibility: 'private'
  });

  const [budgetSettings, setBudgetSettings] = useState({
    monthlyBudget: '2000',
    savingsGoal: '500',
    budgetAlertThreshold: '80'
  });

  const [darkMode, setDarkMode] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly. You'll receive an email when it's complete.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted. This action cannot be undone.",
      variant: "destructive",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `${darkMode ? 'Light' : 'Dark'} Mode Enabled`,
      description: `Switched to ${darkMode ? 'light' : 'dark'} mode successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings.
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Pro Plan
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback className="text-lg">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={profile.currency} onValueChange={(value) => setProfile({ ...profile, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="btn-financial">
                Save Profile Changes
              </Button>
            </CardContent>
          </Card>

          {/* Budget Settings */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Budget & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyBudget">Monthly Budget</Label>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    placeholder="2000"
                    value={budgetSettings.monthlyBudget}
                    onChange={(e) => setBudgetSettings({ ...budgetSettings, monthlyBudget: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingsGoal">Monthly Savings Goal</Label>
                  <Input
                    id="savingsGoal"
                    type="number"
                    placeholder="500"
                    value={budgetSettings.savingsGoal}
                    onChange={(e) => setBudgetSettings({ ...budgetSettings, savingsGoal: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Budget Alert (%)</Label>
                  <Input
                    id="alertThreshold"
                    type="number"
                    placeholder="80"
                    value={budgetSettings.budgetAlertThreshold}
                    onChange={(e) => setBudgetSettings({ ...budgetSettings, budgetAlertThreshold: e.target.value })}
                  />
                </div>
              </div>
              <Button className="btn-financial">
                Update Budget Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Get weekly financial summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Budget Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
                  </div>
                  <Switch
                    checked={notifications.budgetAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders to log daily transactions</p>
                  </div>
                  <Switch
                    checked={notifications.transactionReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, transactionReminders: checked })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveNotifications} className="btn-financial">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-muted-foreground">Share anonymized data for insights</p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics Tracking</p>
                    <p className="text-sm text-muted-foreground">Help improve our services</p>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, analytics: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Access Key</p>
                    <p className="text-sm text-muted-foreground">For third-party integrations</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk-1234567890abcdef..."
                      readOnly
                      className="w-48"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Two-Factor Auth
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="card-financial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Used:</span>
                  <span className="font-medium">2.3 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transactions:</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-medium">Aug 2025</span>
                </div>
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="card-financial border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                These actions are irreversible. Please be careful.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" className="w-full" onClick={logout}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}