/**
 * Hotel PMS - Admin Reports Page
 * Analytics and reporting dashboard
 */

import * as React from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BedDouble,
  ChefHat,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common';

/**
 * Revenue data by month
 */
const revenueData = [
  { month: 'Jan', rooms: 1850000, restaurant: 420000, other: 85000 },
  { month: 'Feb', rooms: 1920000, restaurant: 480000, other: 92000 },
  { month: 'Mar', rooms: 2150000, restaurant: 560000, other: 110000 },
  { month: 'Apr', rooms: 1980000, restaurant: 510000, other: 95000 },
  { month: 'May', rooms: 2350000, restaurant: 620000, other: 125000 },
  { month: 'Jun', rooms: 2480000, restaurant: 680000, other: 140000 },
];

/**
 * Occupancy data by month
 */
const occupancyData = [
  { month: 'Jan', rate: 68 },
  { month: 'Feb', rate: 72 },
  { month: 'Mar', rate: 78 },
  { month: 'Apr', rate: 75 },
  { month: 'May', rate: 82 },
  { month: 'Jun', rate: 85 },
];

/**
 * Room type performance
 */
const roomTypePerformance = [
  { type: 'Standard Room', revenue: 4250000, occupancy: 92, bookings: 480 },
  { type: 'Deluxe Room', revenue: 3850000, occupancy: 85, bookings: 320 },
  { type: 'Executive Suite', revenue: 2150000, occupancy: 78, bookings: 145 },
  { type: 'Family Suite', revenue: 1450000, occupancy: 65, bookings: 85 },
  { type: 'Presidential Suite', revenue: 980000, occupancy: 45, bookings: 28 },
];

/**
 * Top menu items
 */
const topMenuItems = [
  { name: 'Dal Bhat Set', quantity: 1250, revenue: 437500 },
  { name: 'Momo (Chicken)', quantity: 980, revenue: 274400 },
  { name: 'Butter Chicken', quantity: 720, revenue: 324000 },
  { name: 'English Breakfast', quantity: 650, revenue: 357500 },
  { name: 'Grilled Chicken', quantity: 480, revenue: 312000 },
];

/**
 * Guest demographics
 */
const guestDemographics = [
  { country: 'Nepal', percentage: 45, count: 1850 },
  { country: 'India', percentage: 22, count: 905 },
  { country: 'USA', percentage: 12, count: 495 },
  { country: 'UK', percentage: 8, count: 330 },
  { country: 'China', percentage: 6, count: 247 },
  { country: 'Others', percentage: 7, count: 288 },
];

/**
 * AdminReportsPage component
 */
export default function AdminReportsPage() {
  // State
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [period, setPeriod] = React.useState('this-month');

  // KPI calculations
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.rooms + d.restaurant + d.other, 0);
  const avgOccupancy = Math.round(occupancyData.reduce((sum, d) => sum + d.rate, 0) / occupancyData.length);
  const totalBookings = roomTypePerformance.reduce((sum, d) => sum + d.bookings, 0);
  const totalGuests = guestDemographics.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="View hotel performance metrics and insights"
        actions={
          <div className="flex gap-3">
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
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full md:w-[200px]">
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
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">NPR {(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Total Revenue (YTD)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BedDouble className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{avgOccupancy}%</p>
              <p className="text-sm text-muted-foreground">Avg Occupancy Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{totalBookings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge variant="secondary" className="h-6">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.1
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">4.7</p>
              <p className="text-sm text-muted-foreground">Guest Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="occupancy">
            <BedDouble className="h-4 w-4 mr-2" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="restaurant">
            <ChefHat className="h-4 w-4 mr-2" />
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="guests">
            <Users className="h-4 w-4 mr-2" />
            Guests
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue Chart Placeholder */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chart placeholder */}
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Revenue chart visualization
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (Integrate with Recharts)
                    </p>
                  </div>
                </div>
                
                {/* Revenue breakdown */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-700">
                      NPR {(revenueData.reduce((s, d) => s + d.rooms, 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-sm text-blue-600">Rooms</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-700">
                      NPR {(revenueData.reduce((s, d) => s + d.restaurant, 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-sm text-green-600">Restaurant</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-xl font-bold text-purple-700">
                      NPR {(revenueData.reduce((s, d) => s + d.other, 0) / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-purple-600">Other</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Type Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Room Performance</CardTitle>
                <CardDescription>Revenue by room type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roomTypePerformance.map((room, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{room.type}</span>
                      <span className="text-muted-foreground">
                        NPR {(room.revenue / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <Progress
                      value={(room.revenue / roomTypePerformance[0].revenue) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{room.bookings} bookings</span>
                      <span>{room.occupancy}% occupancy</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Occupancy Tab */}
        <TabsContent value="occupancy" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Occupancy Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Occupancy Rate Trend
                </CardTitle>
                <CardDescription>Monthly occupancy percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Occupancy chart visualization
                    </p>
                  </div>
                </div>
                
                {/* Monthly data */}
                <div className="grid grid-cols-6 gap-2 mt-6">
                  {occupancyData.map((data, idx) => (
                    <div key={idx} className="text-center">
                      <div
                        className="w-full bg-primary/20 rounded-t-lg mx-auto"
                        style={{ height: `${data.rate}px` }}
                      >
                        <div
                          className="w-full bg-primary rounded-t-lg"
                          style={{ height: `${data.rate}%` }}
                        />
                      </div>
                      <p className="text-xs font-medium mt-1">{data.rate}%</p>
                      <p className="text-xs text-muted-foreground">{data.month}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Room Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Room Status</CardTitle>
                <CardDescription>Real-time room availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-lg mb-6">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Room status pie chart
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-500" />
                      <span>Occupied</span>
                    </div>
                    <span className="font-bold">39 rooms (78%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-green-500" />
                      <span>Available</span>
                    </div>
                    <span className="font-bold">8 rooms (16%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span>Maintenance</span>
                    </div>
                    <span className="font-bold">3 rooms (6%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Restaurant Tab */}
        <TabsContent value="restaurant" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performing menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMenuItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} orders
                          </p>
                        </div>
                      </div>
                      <span className="font-bold">
                        NPR {item.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Overview</CardTitle>
                <CardDescription>Key metrics summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">2,850</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">NPR 1,182</p>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">18 min</p>
                    <p className="text-sm text-muted-foreground">Avg Prep Time</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">4.6</p>
                    <p className="text-sm text-muted-foreground">Food Rating</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Room Service</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Restaurant</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Takeaway</span>
                    <span className="font-medium">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guests Tab */}
        <TabsContent value="guests" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Guest Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Demographics</CardTitle>
                <CardDescription>Guests by country of origin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-lg mb-6">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Demographics pie chart
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {guestDemographics.map((demo, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{
                          demo.country === 'Nepal' ? '🇳🇵' :
                          demo.country === 'India' ? '🇮🇳' :
                          demo.country === 'USA' ? '🇺🇸' :
                          demo.country === 'UK' ? '🇬🇧' :
                          demo.country === 'China' ? '🇨🇳' : '🌍'
                        }</span>
                        <div>
                          <p className="font-medium">{demo.country}</p>
                          <p className="text-xs text-muted-foreground">
                            {demo.count.toLocaleString()} guests
                          </p>
                        </div>
                      </div>
                      <span className="font-bold">{demo.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guest Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Insights</CardTitle>
                <CardDescription>Key guest metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{totalGuests.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Guests (YTD)</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">2.3</p>
                    <p className="text-sm text-muted-foreground">Avg Nights/Stay</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">28%</p>
                    <p className="text-sm text-muted-foreground">Return Rate</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">VIP Guests</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Booking Sources</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Direct Website</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>OTA (Booking.com, etc.)</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Walk-in</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Downloadable Reports</CardTitle>
          <CardDescription>Generate and download detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="h-8 w-8" />
              <span>Revenue Report</span>
              <span className="text-xs text-muted-foreground">PDF/Excel</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="h-8 w-8" />
              <span>Occupancy Report</span>
              <span className="text-xs text-muted-foreground">PDF/Excel</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="h-8 w-8" />
              <span>Guest Report</span>
              <span className="text-xs text-muted-foreground">PDF/Excel</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="h-8 w-8" />
              <span>Financial Report</span>
              <span className="text-xs text-muted-foreground">PDF/Excel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
