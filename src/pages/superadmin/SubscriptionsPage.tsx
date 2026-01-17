/**
 * Hotel PMS - Super Admin Subscriptions Page
 * Manage subscription plans and billing using centralized mock data
 */

import * as React from 'react';
import {
  CreditCard,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Crown,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  mockSubscriptions,
  subscriptionTierConfig,
  subscriptionStatusConfig,
  type Subscription,
  type SubscriptionTier,
  type SubscriptionStatus,
} from '@/data/mockData';
import { subscriptionDataService } from '@/services/dataService';

/**
 * Format currency helper
 */
const formatCurrency = (amount: number) => `NPR ${amount.toLocaleString()}`;

/**
 * Subscriptions loading skeleton
 */
function SubscriptionsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SuperAdminSubscriptionsPage component
 */
export default function SuperAdminSubscriptionsPage() {
  // State
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>(mockSubscriptions);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [tierFilter, setTierFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = React.useState<Subscription | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load data
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await subscriptionDataService.getAll();
        setSubscriptions(data);
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
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
      const data = await subscriptionDataService.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to refresh subscriptions:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter subscriptions
  const filteredSubscriptions = React.useMemo(() => {
    return subscriptions.filter((sub) => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch = sub.hotelName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Tier filter
      if (tierFilter !== 'all' && sub.tier !== tierFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;

      return true;
    });
  }, [subscriptions, debouncedSearch, tierFilter, statusFilter]);

  // View subscription details
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setDetailsOpen(true);
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    const active = subscriptions.filter((s) => s.status === 'active').length;
    const trial = subscriptions.filter((s) => s.status === 'trial').length;
    const totalMRR = subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.monthlyPrice, 0);
    const avgUsage = Math.round(
      subscriptions.reduce((sum, s) => sum + (s.roomsUsed / s.roomLimit) * 100, 0) / subscriptions.length
    );

    return { active, trial, totalMRR, avgUsage };
  }, [subscriptions]);

  // Get tier icon
  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'basic':
        return Star;
      case 'professional':
        return Zap;
      case 'enterprise':
        return Crown;
      default:
        return Star;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage hotel subscription plans and billing"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.trial}</p>
                <p className="text-sm text-muted-foreground">On Trial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalMRR)}</p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgUsage}%</p>
                <p className="text-sm text-muted-foreground">Avg Room Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hotel name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>
            Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SubscriptionsSkeleton />
          ) : filteredSubscriptions.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No subscriptions found"
              description="No subscriptions match your current filters."
            />
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => {
                const tierInfo = subscriptionTierConfig[subscription.tier];
                const statusInfo = subscriptionStatusConfig[subscription.status];
                const TierIcon = getTierIcon(subscription.tier);
                const usagePercent = Math.round(
                  (subscription.roomsUsed / subscription.roomLimit) * 100
                );

                return (
                  <div key={subscription.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-lg flex items-center justify-center",
                          tierInfo?.color || 'bg-gray-100'
                        )}>
                          <TierIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{subscription.hotelName}</h4>
                            <Badge variant={statusInfo?.variant || 'default'}>
                              {statusInfo?.label || subscription.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TierIcon className="h-4 w-4" />
                              {tierInfo?.label || subscription.tier}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(subscription.monthlyPrice)}/mo
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Expires {formatDate(subscription.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(subscription)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Usage Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Room Usage: {subscription.roomsUsed} / {subscription.roomLimit}
                        </span>
                        <span className={cn(
                          "font-medium",
                          usagePercent >= 90 && "text-red-600 dark:text-red-400",
                          usagePercent >= 70 && usagePercent < 90 && "text-yellow-600 dark:text-yellow-400",
                          usagePercent < 70 && "text-green-600 dark:text-green-400"
                        )}>
                          {usagePercent}%
                        </span>
                      </div>
                      <Progress
                        value={usagePercent}
                        className={cn(
                          "h-2",
                          usagePercent >= 90 && "[&>div]:bg-red-500",
                          usagePercent >= 70 && usagePercent < 90 && "[&>div]:bg-yellow-500"
                        )}
                      />
                    </div>

                    {/* Features */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {subscription.features.slice(0, 4).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {subscription.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{subscription.features.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Full details of the subscription plan
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-6">
              {/* Hotel Info */}
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-16 w-16 rounded-lg flex items-center justify-center",
                  subscriptionTierConfig[selectedSubscription.tier]?.color
                )}>
                  {React.createElement(getTierIcon(selectedSubscription.tier), { className: "h-8 w-8" })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedSubscription.hotelName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={subscriptionStatusConfig[selectedSubscription.status]?.variant || 'default'}>
                      {selectedSubscription.status}
                    </Badge>
                    <Badge variant="outline">
                      {subscriptionTierConfig[selectedSubscription.tier]?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Price</p>
                  <p className="text-xl font-bold">{formatCurrency(selectedSubscription.monthlyPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auto Renew</p>
                  <p className="font-medium">{selectedSubscription.autoRenew ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(selectedSubscription.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(selectedSubscription.endDate)}</p>
                </div>
              </div>

              {/* Room Usage */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Room Usage</p>
                <div className="flex items-center gap-4">
                  <Progress
                    value={(selectedSubscription.roomsUsed / selectedSubscription.roomLimit) * 100}
                    className="h-3 flex-1"
                  />
                  <span className="font-medium">
                    {selectedSubscription.roomsUsed} / {selectedSubscription.roomLimit} rooms
                  </span>
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Included Features</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSubscription.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            <Button>Edit Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
