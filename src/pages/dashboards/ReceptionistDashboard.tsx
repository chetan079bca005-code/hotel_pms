import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Users, BedDouble, LogOut, Clock, Search, Filter, Phone, Mail, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ReceptionistDashboard() {
    const { toast } = useToast();

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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Arrivals Today</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">4 checked in</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Departures</CardTitle>
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">2 checked out</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In House</CardTitle>
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">85% occupancy</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Clean & Ready</p>
                    </CardContent>
                </Card>
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
                                    <TabsTrigger value="arrivals">Arrivals (12)</TabsTrigger>
                                    <TabsTrigger value="departures">Departures (8)</TabsTrigger>
                                    <TabsTrigger value="inhouse">In House (45)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="arrivals" className="mt-4">
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>JD</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">John Doe</p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Badge variant="outline">Room 10{i}</Badge>
                                                            <span>•</span>
                                                            <span>2 Adults</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">Booked via Booking.com</p>
                                                        <p className="text-xs text-muted-foreground">Paid</p>
                                                    </div>
                                                    <Button size="sm" onClick={() => handleAction('Check In', 'John Doe')}>Check In</Button>
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
                            <div className="flex items-start gap-3 pb-3 border-b">
                                <Clock className="h-4 w-4 text-orange-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium">Wake up call</p>
                                    <p className="text-xs text-muted-foreground">Room 204 • 6:00 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pb-3 border-b">
                                <Phone className="h-4 w-4 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium">Taxi to Airport</p>
                                    <p className="text-xs text-muted-foreground">Room 305 • 10:30 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-green-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium">Extra Towels</p>
                                    <p className="text-xs text-muted-foreground">Room 102 • Just now</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 text-card-foreground border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Shift Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Room 201 VIP guest arriving at 2 PM. Please ensure amenities are placed.
                                <br /><br />
                                Night audit needs to run at 11 PM.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
