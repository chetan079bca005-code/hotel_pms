import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Users, BedDouble, LogOut, Clock, Search, Filter, Phone, Mail, Plus, LucideIcon } from 'lucide-react';
import {
    mockReceptionistStats,
    mockGuestActivity,
    mockFrontDeskRequests,
    mockShiftNotes
} from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ReceptionistDashboard() {
    const { toast } = useToast();

    // Icon mapping
    const iconMap: Record<string, LucideIcon> = {
        'Users': Users,
        'LogOut': LogOut,
        'BedDouble': BedDouble,
        'Search': Search,
        'Clock': Clock,
        'Phone': Phone,
        'Mail': Mail,
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleAction = (action: string, guest: string) => {
        toast({
            title: `${action} Successful`,
            description: `${guest} has been successfully processed.`,
        });
    };

    const handleFilter = () => {
        toast({
            title: "Filters Applied",
            description: "Showing filtered results for today.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Reception</h1>
                    <p className="text-muted-foreground">{today}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleFilter}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button asChild>
                        <Link to="/admin/bookings">
                            <Plus className="h-4 w-4 mr-2" />
                            New Booking
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Guest-Facing Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockReceptionistStats.map((stat) => {
                    const Icon = iconMap[stat.iconName] || Users;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Content Area */}
                <div className="col-span-1 md:col-span-5 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Guest Activity</CardTitle>
                                    <CardDescription>Manage check-ins and check-outs</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Search guest..." className="w-[200px] h-8" />
                                    <Button variant="outline" size="sm" onClick={handleFilter}><Filter className="h-3 w-3" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="arrivals" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="arrivals">Arrivals ({mockGuestActivity.arrivals.length})</TabsTrigger>
                                    <TabsTrigger value="departures">Departures ({mockGuestActivity.departures.length})</TabsTrigger>
                                    <TabsTrigger value="inhouse">In House (45)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="arrivals" className="mt-4">
                                    <div className="space-y-4">
                                        {mockGuestActivity.arrivals.map((guest) => (
                                            <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>{guest.guest.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{guest.guest}</p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Badge variant="outline">Room {guest.room}</Badge>
                                                            <span>•</span>
                                                            <span>{guest.pax}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">Booked via {guest.source}</p>
                                                        <p className="text-xs text-muted-foreground">{guest.status}</p>
                                                    </div>
                                                    <Button size="sm" onClick={() => handleAction('Check In', guest.guest)}>Check In</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="departures">
                                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                                        No pending departures
                                    </div>
                                </TabsContent>
                                <TabsContent value="inhouse">
                                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                                        45 guests in house
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Quick Actions */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Front Desk Requests</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockFrontDeskRequests.map((request, idx) => {
                                const Icon = iconMap[request.iconName] || Clock;
                                return (
                                    <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                        <Icon className={`h-4 w-4 ${request.color} mt-1`} />
                                        <div>
                                            <p className="text-sm font-medium">{request.type}</p>
                                            <p className="text-xs text-muted-foreground">Room {request.room} • {request.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 text-card-foreground border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Shift Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {mockShiftNotes}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
