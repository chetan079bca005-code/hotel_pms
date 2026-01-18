/**
 * Hotel PMS - Super Admin Overview Page
 * Multi-property overview dashboard with centralized data
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BedDouble,
  ChefHat,
  Star,
  AlertTriangle,
  ArrowUpRight,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/common';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Import centralized mock data
import {
  mockHotelPerformance,
  mockRecentActivities,
  calculatePortfolioStats,
  hotelStatusConfig,
  type HotelPerformance,
  type RecentActivity,
} from '@/data/mockData';
import { hotelDataService, activityDataService } from '@/services/dataService';

/**
 * SuperAdminOverviewPage component
 */
export default function SuperAdminOverviewPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for data
  const [hotelsData, setHotelsData] = React.useState<HotelPerformance[]>(mockHotelPerformance);
  const [activities, setActivities] = React.useState<RecentActivity[]>(mockRecentActivities);
  const [isLoading, setIsLoading] = React.useState(false);
  const [stats, setStats] = React.useState(calculatePortfolioStats());

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [performance, recentActivities, portfolioStats] = await Promise.all([
        hotelDataService.getHotelPerformance(),
        activityDataService.getRecentActivities(),
        hotelDataService.getPortfolioStats(),
      ]);

      setHotelsData(performance);
      setActivities(recentActivities);
      setStats(portfolioStats);

      toast({
        title: 'Data Refreshed',
        description: 'Dashboard data has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to refresh data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `NPR ${(amount / 1000000).toFixed(1)}M`;
    }
    return `NPR ${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Property Overview"
        description={`Managing ${stats.totalHotels} properties across Nepal`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={() => navigate('/superadmin/hotels')}>
              <Building2 className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        }
      />

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats.totalHotels}</p>
              )}
              <p className="text-sm text-muted-foreground">Properties</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stats.activeHotels} active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15%
              </Badge>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              )}
              <p className="text-sm text-muted-foreground">Total Revenue (MTD)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BedDouble className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats.avgOccupancy}%</p>
              )}
              <p className="text-sm text-muted-foreground">Avg Occupancy</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalRooms} total rooms
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-3xl font-bold">{stats.avgRating}</p>
              )}
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all properties
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "hover:shadow-md transition-shadow",
          stats.totalAlerts > 0 && 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
        )}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {stats.totalAlerts > 0 && (
                <Badge variant="destructive">Action needed</Badge>
              )}
            </div>
            <div className="mt-4">
              {isLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                <p className="text-3xl font-bold">{stats.totalAlerts}</p>
              )}
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Property Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Current month metrics by property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))
            ) : (
              hotelsData.map((hotel) => (
                <div
                  key={hotel.id}
                  className={cn(
                    'p-4 rounded-lg border transition-all hover:shadow-md',
                    hotel.status === 'maintenance' && 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={hotel.logo} alt={hotel.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {hotel.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{hotel.name}</h4>
                          {hotel.alerts > 0 && (
                            <Badge variant="destructive" className="h-5">
                              {hotel.alerts} alerts
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {hotel.city}, {hotel.country}
                        </p>
                      </div>
                    </div>
                    <Badge variant={hotel.status === 'active' ? 'success' : hotel.status === 'maintenance' ? 'warning' : 'secondary'}>
                      {hotelStatusConfig[hotel.status].label}
                    </Badge>
                  </div>

                  {hotel.status === 'active' && (
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{formatCurrency(hotel.revenue)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Occupancy</p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{hotel.occupancy}%</p>
                          <Progress value={hotel.occupancy} className="w-16 h-2" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rooms</p>
                        <p className="font-semibold">{hotel.roomCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <p className="font-semibold">{hotel.rating}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hotel.status === 'maintenance' && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Property is under maintenance. No active bookings.
                    </p>
                  )}

                  <Button variant="ghost" size="sm" className="mt-3" onClick={() => navigate('/superadmin/hotels')}>
                    View Dashboard
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                      activity.type === 'booking' && 'bg-blue-100 dark:bg-blue-900/30',
                      activity.type === 'alert' && 'bg-red-100 dark:bg-red-900/30',
                      activity.type === 'revenue' && 'bg-green-100 dark:bg-green-900/30',
                      activity.type === 'system' && 'bg-gray-100 dark:bg-gray-800'
                    )}>
                      {activity.type === 'booking' && <BedDouble className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'alert' && <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                      {activity.type === 'revenue' && <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />}
                      {activity.type === 'system' && <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{activity.hotel}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/superadmin/logs')}>
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
          <CardDescription>Monthly revenue across all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/30 dark:bg-muted/10 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Revenue comparison chart
              </p>
              <p className="text-xs text-muted-foreground">
                (Integrate with Recharts for visualization)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
