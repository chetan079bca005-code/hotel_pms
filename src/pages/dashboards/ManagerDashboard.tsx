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
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    ChefHat,
    Star,
    BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/**
 * Stats card data
 */
const statsData = [
    {
        title: 'Total Bookings',
        value: '156',
        change: '+12.5%',
        changeType: 'positive' as const,
        icon: Calendar,
        description: 'This month',
    },
    {
        title: 'Occupancy Rate',
        value: '78%',
        change: '+5.2%',
        changeType: 'positive' as const,
        icon: BedDouble,
        description: 'Current',
    },
    {
        title: 'Revenue',
        value: 'NPR 2.4M',
        change: '+18.3%',
        changeType: 'positive' as const,
        icon: DollarSign,
        description: 'This month',
    },
    {
        title: 'Total Guests',
        value: '324',
        change: '-2.1%',
        changeType: 'negative' as const,
        icon: Users,
        description: 'This month',
    },
];

/**
 * Room availability data
 */
const roomAvailability = {
    total: 50,
    occupied: 39,
    available: 8,
    maintenance: 3,
};

/**
 * Recent bookings data
 */
const recentBookings = [
    {
        id: '1',
        guest: 'Ramesh Sharma',
        room: 'Deluxe Suite 305',
        checkIn: '2024-01-20',
        checkOut: '2024-01-23',
        status: 'confirmed',
        amount: 54000,
    },
    {
        id: '2',
        guest: 'Sarah Johnson',
        room: 'Executive Room 201',
        checkIn: '2024-01-21',
        checkOut: '2024-01-24',
        status: 'pending',
        amount: 36000,
    },
    {
        id: '3',
        guest: 'Priya Patel',
        room: 'Standard Room 102',
        checkIn: '2024-01-20',
        checkOut: '2024-01-21',
        status: 'checked-in',
        amount: 8000,
    },
    {
        id: '4',
        guest: 'John Smith',
        room: 'Presidential Suite',
        checkIn: '2024-01-22',
        checkOut: '2024-01-28',
        status: 'confirmed',
        amount: 270000,
    },
];

/**
 * Pending orders data
 */
const pendingOrders = [
    {
        id: 'ORD001',
        items: 'Dal Bhat Set, Momo (2)',
        room: '305',
        time: '5 min ago',
        total: 910,
        status: 'preparing',
    },
    {
        id: 'ORD002',
        items: 'Butter Chicken, Naan (2)',
        room: '201',
        time: '8 min ago',
        total: 650,
        status: 'pending',
    },
    {
        id: 'ORD003',
        items: 'English Breakfast',
        room: '102',
        time: '12 min ago',
        total: 550,
        status: 'preparing',
    },
];

/**
 * Today's arrivals/departures
 */
const todayActivity = {
    arrivals: [
        { guest: 'Mike Wilson', room: '401', time: '14:00' },
        { guest: 'Emma Brown', room: '208', time: '15:30' },
        { guest: 'David Lee', room: '312', time: '16:00' },
    ],
    departures: [
        { guest: 'Lisa Chen', room: '105', time: '10:00' },
        { guest: 'Tom Harris', room: '209', time: '11:00' },
    ],
};

/**
 * Housekeeping tasks
 */
const housekeepingTasks = [
    { room: '105', type: 'Checkout Clean', priority: 'high', assignee: 'Maya' },
    { room: '209', type: 'Checkout Clean', priority: 'high', assignee: 'Rita' },
    { room: '303', type: 'Touch-up', priority: 'medium', assignee: 'Sita' },
    { room: '107', type: 'Deep Clean', priority: 'low', assignee: 'Maya' },
];

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
                {statsData.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <stat.icon className="h-5 w-5 text-primary" />
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
                ))}
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
                                {Math.round((roomAvailability.occupied / roomAvailability.total) * 100)}%
                            </span>
                        </div>
                        <Progress
                            value={(roomAvailability.occupied / roomAvailability.total) * 100}
                            className="h-3"
                        />

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{roomAvailability.available}</p>
                                <p className="text-xs text-muted-foreground">Available</p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{roomAvailability.occupied}</p>
                                <p className="text-xs text-muted-foreground">Occupied</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{roomAvailability.maintenance}</p>
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
                                    Arrivals ({todayActivity.arrivals.length})
                                </TabsTrigger>
                                <TabsTrigger value="departures" className="flex-1">
                                    Departures ({todayActivity.departures.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="arrivals" className="mt-4 space-y-3">
                                {todayActivity.arrivals.map((arrival, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {arrival.guest.split(' ').map((n) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{arrival.guest}</p>
                                                <p className="text-xs text-muted-foreground">Room {arrival.room}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{arrival.time}</Badge>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="departures" className="mt-4 space-y-3">
                                {todayActivity.departures.map((departure, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {departure.guest.split(' ').map((n) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{departure.guest}</p>
                                                <p className="text-xs text-muted-foreground">Room {departure.room}</p>
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
                            <CardDescription>{pendingOrders.length} pending orders</CardDescription>
                        </div>
                        <ChefHat className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingOrders.map((order) => (
                            <div key={order.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm">{order.id}</span>
                                    <Badge variant={order.status === 'preparing' ? 'default' : 'warning'}>
                                        {order.status === 'preparing' ? 'Preparing' : 'Pending'}
                                    </Badge>
                                </div>
                                <p className="text-sm font-medium">{order.items}</p>
                                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                                    <span>Room {order.room}</span>
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
                            {recentBookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {booking.guest.split(' ').map((n) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{booking.guest}</p>
                                            <p className="text-sm text-muted-foreground">{booking.room}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={bookingStatusConfig[booking.status].variant}>
                                            {bookingStatusConfig[booking.status].label}
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
                            {housekeepingTasks.map((task, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium',
                                                task.priority === 'high' && 'bg-red-100 text-red-700',
                                                task.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                                                task.priority === 'low' && 'bg-green-100 text-green-700'
                                            )}
                                        >
                                            {task.room}
                                        </div>
                                        <div>
                                            <p className="font-medium">{task.type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Assigned to {task.assignee}
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
