import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Clock, CheckCircle, AlertTriangle, Plus, RotateCcw, LucideIcon } from 'lucide-react';
import { mockKitchenStats, mockKitchenTickets } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function KitchenDashboard() {
    const { toast } = useToast();

    // Icon mapping
    const iconMap: Record<string, LucideIcon> = {
        'AlertTriangle': AlertTriangle,
        'UtensilsCrossed': UtensilsCrossed,
        'CheckCircle': CheckCircle,
        'Clock': Clock,
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
        toast({
            title: `Order Updated: ${orderId}`,
            description: `Order status changed to: ${newStatus}`,
        });
    };

    const handlePanic = () => {
        toast({
            variant: "destructive",
            title: "PANIC ALERT TRIGGERED",
            description: "Manager and Front Desk have been notified of high traffic.",
        });
    };

    const simulateNewOrder = () => {
        toast({
            title: "New Order Received",
            description: "Table 5 - 2 items added to Pending.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kitchen Display System (KDS)</h1>
                    <p className="text-muted-foreground">Live order management</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={simulateNewOrder}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Simulate Order
                    </Button>
                    <Button variant="destructive" onClick={handlePanic}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Panic Button
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockKitchenStats.map((stat) => {
                    const Icon = iconMap[stat.iconName] || Clock;
                    return (
                        <Card key={stat.title} className={`${stat.bgColor || ''} ${stat.borderColor || ''}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stat.color !== 'text-muted-foreground' ? stat.color : ''}`}>{stat.value}</div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">{stat.subtext}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Ticket Mockups - New */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-500"></div> NEW ({mockKitchenTickets.new.length})</h3>
                    {mockKitchenTickets.new.map((ticket) => (
                        <Card key={ticket.id} className="border-l-4 border-l-red-500 shadow-md">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{ticket.location}</CardTitle>
                                    <Badge variant="outline">{ticket.id}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{ticket.time}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {ticket.items.map((item, idx) => (
                                        <div key={idx} className={`flex justify-between ${item.isNote ? 'text-muted-foreground px-2 text-xs' : 'font-medium'}`}>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" className={`w-full ${ticket.btnColor}`} onClick={() => handleStatusChange(ticket.id, ticket.targetStatus)}>{ticket.action}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Ticket Mockups - Cooking */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-yellow-500"></div> COOKING ({mockKitchenTickets.cooking.length})</h3>
                    {mockKitchenTickets.cooking.map((ticket) => (
                        <Card key={ticket.id} className="border-l-4 border-l-yellow-500 opacity-90">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{ticket.location}</CardTitle>
                                    <Badge variant="outline">{ticket.id}</Badge>
                                </div>
                                <p className={`text-xs ${ticket.timeColor || ''} font-medium`}>{ticket.time}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {ticket.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between font-medium">
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" className={`w-full ${ticket.btnColor}`} onClick={() => handleStatusChange(ticket.id, ticket.targetStatus)}>{ticket.action}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Ticket Mockups - Ready */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-green-500"></div> READY ({mockKitchenTickets.ready.length})</h3>
                    {mockKitchenTickets.ready.map((ticket) => (
                        <Card key={ticket.id} className="border-l-4 border-l-green-500 bg-green-50/50">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{ticket.location}</CardTitle>
                                    <Badge variant="outline">{ticket.id}</Badge>
                                </div>
                                <p className={`text-xs ${ticket.timeColor || ''}`}>{ticket.time}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm opacity-50">
                                    {ticket.items.map((item, idx) => (
                                        <div key={idx} className={`flex justify-between font-medium ${item.isDimmed ? 'underline' : ''}`}>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusChange(ticket.id, ticket.targetStatus)}>{ticket.action}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
