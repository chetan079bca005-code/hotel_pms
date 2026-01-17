/**
 * Hotel PMS - Super Admin System Configuration Page
 * System-wide settings and configuration using centralized mock data
 */

import * as React from 'react';
import {
  Settings,
  Database,
  Server,
  Shield,
  Mail,
  Globe,
  Bell,
  Key,
  Save,
  Loader2,
  RefreshCw,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  mockSystemMetrics,
  mockServiceStatus,
  type SystemMetrics,
  type ServiceStatus,
} from '@/data/mockData';
import { systemDataService } from '@/services/dataService';

/**
 * System loading skeleton
 */
function SystemSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * SuperAdminSystemPage component
 */
export default function SuperAdminSystemPage() {
  const { toast } = useToast();

  // State
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('general');
  const [systemMetrics, setSystemMetrics] = React.useState<SystemMetrics>(mockSystemMetrics);
  const [serviceStatus, setServiceStatus] = React.useState<ServiceStatus[]>(mockServiceStatus);

  // Email settings state
  const [smtpHost, setSmtpHost] = React.useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = React.useState('587');
  const [smtpUser, setSmtpUser] = React.useState('notifications@hotelpms.com');

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);

  // Load data
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [metrics, services] = await Promise.all([
          systemDataService.getMetrics(),
          systemDataService.getServiceStatus(),
        ]);
        setSystemMetrics(metrics);
        setServiceStatus(services);
      } catch (error) {
        console.error('Failed to load system data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [metrics, services] = await Promise.all([
        systemDataService.getMetrics(),
        systemDataService.getServiceStatus(),
      ]);
      setSystemMetrics(metrics);
      setServiceStatus(services);
      toast({ title: 'System Status Refreshed', description: 'All metrics have been updated.' });
    } catch (error) {
      console.error('Failed to refresh system data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({ title: 'Settings Saved', description: 'System configuration has been updated successfully.' });
  };

  // Test connection
  const handleTestConnection = () => {
    toast({ title: 'Testing Connection', description: 'SMTP connection test successful!' });
  };

  // Format uptime
  const formatUptime = (timestamp: string) => {
    const start = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Count running services
  const runningServices = serviceStatus.filter((s) => s.status === 'running').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="System Configuration"
          description="Manage system-wide settings and monitoring"
        />
        <SystemSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Configuration"
        description="Manage system-wide settings and monitoring"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* System Health Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="success">
                {systemMetrics.status === 'healthy' ? 'Healthy' : 'Degraded'}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{systemMetrics.uptime}</p>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{runningServices}/{serviceStatus.length}</p>
              <p className="text-sm text-muted-foreground">Services Running</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{systemMetrics.databaseSize}</p>
              <p className="text-sm text-muted-foreground">Database Size</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{systemMetrics.requestsPerMinute}</p>
              <p className="text-sm text-muted-foreground">Requests/min</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Monitor all system services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceStatus.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  service.status === 'running' && "bg-green-500 animate-pulse",
                  service.status === 'stopped' && "bg-red-500",
                  service.status === 'degraded' && "bg-yellow-500"
                )} />
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{service.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">CPU</p>
                  <div className="flex items-center gap-2">
                    <Progress value={service.cpu} className="h-2 w-20" />
                    <span className="text-sm font-medium">{service.cpu}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Memory</p>
                  <div className="flex items-center gap-2">
                    <Progress value={service.memory} className="h-2 w-20" />
                    <span className="text-sm font-medium">{service.memory}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="Namaste Hotel PMS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="asia-kathmandu">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kathmandu">Asia/Kathmandu (NPT)</SelectItem>
                      <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="npr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="npr">Nepalese Rupee (NPR)</SelectItem>
                      <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input
                    id="smtp-user"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" defaultValue="********" />
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleTestConnection}>
                  Test Connection
                </Button>
                <Button variant="outline">
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure notification channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically logout inactive users
                  </p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP Whitelisting</Label>
                  <p className="text-sm text-muted-foreground">
                    Restrict access to specific IP addresses
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Password Policy</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Uppercase required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Lowercase required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Number required</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-muted-foreground">pk_live_**********************</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reveal</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Test API Key</p>
                    <p className="text-sm text-muted-foreground">pk_test_**********************</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reveal</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Webhook Secret</p>
                    <p className="text-sm text-muted-foreground">whsec_**********************</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reveal</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
