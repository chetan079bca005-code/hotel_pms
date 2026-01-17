/**
 * Hotel PMS - Super Admin Analytics Page
 * Cross-property analytics and insights using centralized mock data
 */

import * as React from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  BedDouble,
  Users,
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { PageHeader } from '@/components/common';
import { cn } from '@/lib/utils';
import {
  mockPropertyPerformance,
  mockMonthlyTrends,
  mockRevenueByCategory,
  mockGuestDemographics,
  mockTopSegments,
} from '@/data/mockData';
import { analyticsDataService } from '@/services/dataService';

/**
 * Format currency helper
 */
const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `NPR ${(amount / 1000000).toFixed(1)}M`;
  }
  return `NPR ${(amount / 1000).toFixed(0)}K`;
};

/**
 * Analytics loading skeleton
 */
function AnalyticsSkeleton() {
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
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * SuperAdminAnalyticsPage component
 */
export default function SuperAdminAnalyticsPage() {
  // State
  const [period, setPeriod] = React.useState('this-month');
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedProperty, setSelectedProperty] = React.useState<string>('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Data from centralized mock data
  const [propertyPerformance, setPropertyPerformance] = React.useState(mockPropertyPerformance);
  const [monthlyTrends] = React.useState(mockMonthlyTrends);
  const [revenueByCategory] = React.useState(mockRevenueByCategory);
  const [guestDemographics] = React.useState(mockGuestDemographics);
  const [topSegments] = React.useState(mockTopSegments);

  // Simulated data loading
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with dataService
        const data = await analyticsDataService.getPropertyPerformance();
        setPropertyPerformance(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
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
      const data = await analyticsDataService.getPropertyPerformance();
      setPropertyPerformance(data);
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate totals
  const totalRevenue = propertyPerformance.reduce((sum, p) => sum + p.revenue, 0);
  const totalBookings = propertyPerformance.reduce((sum, p) => sum + p.bookings, 0);
  const avgOccupancy = Math.round(
    propertyPerformance.reduce((sum, p) => sum + p.occupancy, 0) / propertyPerformance.length
  );
  const avgRating = (
    propertyPerformance.reduce((sum, p) => sum + p.rating, 0) / propertyPerformance.length
  ).toFixed(1);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics & Insights"
          description="Cross-property performance analytics"
        />
        <AnalyticsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Insights"
        description="Cross-property performance analytics"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {propertyPerformance.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            {period === 'custom' && (
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Select date range"
              />
            )}
            <Button variant="outline" className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.5%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{totalBookings}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BedDouble className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{avgOccupancy}%</p>
              <p className="text-sm text-muted-foreground">Avg Occupancy</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <Badge variant="secondary" className="h-6">
                Stable
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Building2 className="h-4 w-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="guests">
            <Users className="h-4 w-4 mr-2" />
            Guests
          </TabsTrigger>
          <TabsTrigger value="segments">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Segments
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue across all properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <LineChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Revenue trend visualization
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (Integrate with Recharts)
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {monthlyTrends.slice(-3).map((month) => (
                    <div key={month.month} className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{month.month}</p>
                      <p className="text-lg font-bold">{formatCurrency(month.revenue)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Revenue by Category
                </CardTitle>
                <CardDescription>Distribution across revenue streams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-lg mb-4">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Category distribution chart
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {revenueByCategory.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'h-3 w-3 rounded-full',
                          idx === 0 && 'bg-blue-500',
                          idx === 1 && 'bg-green-500',
                          idx === 2 && 'bg-yellow-500',
                          idx === 3 && 'bg-gray-500'
                        )} />
                        <span className="text-sm">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(cat.amount)}</p>
                        <p className="text-xs text-muted-foreground">{cat.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Occupancy Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trend</CardTitle>
              <CardDescription>Monthly occupancy rates across all properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {monthlyTrends.map((month) => (
                  <div key={month.month} className="text-center">
                    <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full bg-primary transition-all"
                        style={{ height: `${month.occupancy}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium mt-2">{month.occupancy}%</p>
                    <p className="text-xs text-muted-foreground">{month.month}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Performance Comparison</CardTitle>
              <CardDescription>Compare metrics across all properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {propertyPerformance.map((property, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{property.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">{property.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{property.bookings} bookings</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                      <p className="font-semibold">{formatCurrency(property.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                      <div className="flex items-center gap-2">
                        <Progress value={property.occupancy} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{property.occupancy}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Revenue Share</p>
                      <p className="font-semibold">
                        {((property.revenue / totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guests Tab */}
        <TabsContent value="guests" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guest Demographics</CardTitle>
                <CardDescription>Guest distribution by country</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {guestDemographics.map((demo, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">{demo.country.slice(0, 2)}</span>
                      </div>
                      <span className="font-medium">{demo.country}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-1 ml-4">
                      <Progress value={demo.percentage} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {demo.guests.toLocaleString()} ({demo.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Statistics</CardTitle>
                <CardDescription>Key guest metrics this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Guests</p>
                    <p className="text-2xl font-bold">
                      {guestDemographics.reduce((sum, d) => sum + d.guests, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Repeat Guests</p>
                    <p className="text-2xl font-bold">28%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Stay Duration</p>
                    <p className="text-2xl font-bold">3.2 nights</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                    <p className="text-2xl font-bold">4.6/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Segments</CardTitle>
              <CardDescription>Revenue and growth by customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSegments.map((segment, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{segment.segment}</h4>
                      <Badge variant={segment.growth > 15 ? 'success' : 'secondary'}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{segment.growth}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Bookings</p>
                        <p className="font-medium">{segment.bookings.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">{formatCurrency(segment.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Value</p>
                        <p className="font-medium">
                          {formatCurrency(segment.revenue / segment.bookings)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
