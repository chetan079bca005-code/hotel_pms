/**
 * Hotel PMS - Manager Dashboard
 * Overview of hotel operations and key metrics
 */

import { Link } from 'react-router-dom';
import {
    BedDouble,
    Users,
    DollarSign,
    Calendar,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    ChefHat,
    Star,
    CheckCircle,
    BarChart3,
    LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
    mockManagerStats,
    mockRoomAvailability,
    mockRecentBookings,
    mockPendingOrders,
    mockTodayActivity,
    mockHousekeepingTasks
} from '@/data/mockData';

// Icon mapping for stats
const iconMap: Record<string, LucideIcon> = {
    'Calendar': Calendar,
    'BedDouble': BedDouble,
    'DollarSign': DollarSign,
    'Users': Users,
};

/**
 * Booking status badge config
 */
const bookingStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' }> = {
    confirmed: { label: 'Confirmed', variant: 'default' },
    pending: { label: 'Pending', variant: 'warning' },
    'checked-in': { label: 'Checked In', variant: 'success' },
    'checked-out': { label: 'Checked Out', variant: 'secondary' },
};

/**
 * ManagerDashboard component
 */
export default function ManagerDashboard() {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">{today}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link to="/admin/reports" className="inline-flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            <span>View Reports</span>
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link to="/admin/bookings" className="inline-flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>New Booking</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockManagerStats.map((stat) => {
                    const Icon = iconMap[stat.iconName] || Calendar;
                    return (
                        <Card key={stat.title}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <Badge
                                        variant={stat.changeType === 'positive' ? 'success' : 'destructive'}
                                        className="h-6"
                                    >
                                        {stat.changeType === 'positive' ? (
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                        )}
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Room Availability */}
                <Card>
                    <CardHeader>
                        <CardTitle>Room Availability</CardTitle>
                        <CardDescription>Current room status overview</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>Occupancy Rate</span>
                            <span className="font-medium">
                                {Math.round((mockRoomAvailability.occupied / mockRoomAvailability.total) * 100)}%
                            </span>
                        </div>
                        <Progress
                            value={(mockRoomAvailability.occupied / mockRoomAvailability.total) * 100}
                            className="h-3"
                        />

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{mockRoomAvailability.available}</p>
                                <p className="text-xs text-muted-foreground">Available</p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{mockRoomAvailability.occupied}</p>
                                <p className="text-xs text-muted-foreground">Occupied</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{mockRoomAvailability.maintenance}</p>
                                <p className="text-xs text-muted-foreground">Maintenance</p>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/rooms" className="inline-flex items-center">
                                <span>Manage Rooms</span>
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Today's Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Activity</CardTitle>
                        <CardDescription>Arrivals and departures</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="arrivals">
                            <TabsList className="w-full">
                                <TabsTrigger value="arrivals" className="flex-1">
                                    Arrivals ({mockTodayActivity.arrivals.length})
                                </TabsTrigger>
                                <TabsTrigger value="departures" className="flex-1">
                                    Departures ({mockTodayActivity.departures.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="arrivals" className="mt-4 space-y-3">
                                {mockTodayActivity.arrivals.map((arrival, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {arrival.guestName.split(' ').map((n) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{arrival.guestName}</p>
                                                <p className="text-xs text-muted-foreground">Room {arrival.roomNumber}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{arrival.time}</Badge>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="departures" className="mt-4 space-y-3">
                                {mockTodayActivity.departures.map((departure, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {departure.guestName.split(' ').map((n) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{departure.guestName}</p>
                                                <p className="text-xs text-muted-foreground">Room {departure.roomNumber}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{departure.time}</Badge>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Kitchen Orders</CardTitle>
                            <CardDescription>{mockPendingOrders.length} pending orders</CardDescription>
                        </div>
                        <ChefHat className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockPendingOrders.map((order) => (
                            <div key={order.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm">{order.id}</span>
                                    <Badge variant={order.status === 'preparing' ? 'default' : 'warning'}>
                                        {order.status === 'preparing' ? 'Preparing' : 'Pending'}
                                    </Badge>
                                </div>
                                <p className="text-sm font-medium">{order.items}</p>
                                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                                    <span>Room {order.roomNumber}</span>
                                    <span>{order.time}</span>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/orders" className="inline-flex items-center">
                                <span>View All Orders</span>
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings & Housekeeping */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>Latest room reservations</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/admin/bookings">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockRecentBookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {booking.guestName.split(' ').map((n) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{booking.guestName}</p>
                                            <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={bookingStatusConfig[booking.status]?.variant || 'default'}>
                                            {bookingStatusConfig[booking.status]?.label || booking.status}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            NPR {booking.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Housekeeping Tasks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Housekeeping Tasks</CardTitle>
                            <CardDescription>Pending cleaning assignments</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/admin/housekeeping">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockHousekeepingTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium',
                                                task.priority === 'high' && 'bg-red-100 text-red-700',
                                                task.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                                                task.priority === 'low' && 'bg-green-100 text-green-700'
                                            )}
                                        >
                                            {task.roomNumber}
                                        </div>
                                        <div>
                                            <p className="font-medium text-capitalize">{task.taskType.replace('-', ' ')}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Assigned to {task.assignee?.name || 'Unassigned'}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            task.priority === 'high'
                                                ? 'destructive'
                                                : task.priority === 'medium'
                                                    ? 'warning'
                                                    : 'secondary'
                                        }
                                    >
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link to="/admin/reports">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100">Today's Revenue</p>
                                    <p className="text-2xl font-bold">NPR 125,000</p>
                                </div>
                                <DollarSign className="h-10 w-10 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/admin/bookings">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100">Check-ins Today</p>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                                <CheckCircle className="h-10 w-10 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/admin/orders">
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100">Restaurant Orders</p>
                                    <p className="text-2xl font-bold">28</p>
                                </div>
                                <ChefHat className="h-10 w-10 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/admin/reviews">
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100">Avg. Rating</p>
                                    <p className="text-2xl font-bold">4.8/5</p>
                                </div>
                                <Star className="h-10 w-10 text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
