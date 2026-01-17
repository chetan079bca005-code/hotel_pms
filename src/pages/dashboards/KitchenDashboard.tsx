import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Clock, CheckCircle, AlertTriangle, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function KitchenDashboard() {
    const { toast } = useToast();

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
                <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">5</div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Needs preparation</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cooking</CardTitle>
                        <UtensilsCrossed className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">3</div>
                        <p className="text-xs text-muted-foreground">On stove</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ready to Serve</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">2</div>
                        <p className="text-xs text-muted-foreground">Waiting for pickup</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18m</div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Target: 20m</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Ticket Mockups */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-500"></div> NEW (2)</h3>
                    <Card className="border-l-4 border-l-red-500 shadow-md">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">Table 12</CardTitle>
                                <Badge variant="outline">#1024</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">2 mins ago</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between font-medium">
                                    <span>2x Chicken Burger</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground px-2 text-xs">
                                    <span>- No onions</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>1x  Fries (L)</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>2x Coke</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => handleStatusChange('#1024', 'Cooking')}>Start Cooking</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-500 shadow-md">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">Room 304</CardTitle>
                                <Badge variant="outline">#1025</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Just now</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between font-medium">
                                    <span>1x Club Sandwich</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>1x Coffee</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => handleStatusChange('#1025', 'Cooking')}>Start Cooking</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-yellow-500"></div> COOKING (3)</h3>
                    <Card className="border-l-4 border-l-yellow-500 opacity-90">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">Table 4</CardTitle>
                                <Badge variant="outline">#1022</Badge>
                            </div>
                            <p className="text-xs text-yellow-600 font-medium">12 mins elapsed</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between font-medium">
                                    <span>1x Pasta Alfredo</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>1x Garlic Bread</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange('#1022', 'Ready')}>Mark Ready</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-green-500"></div> READY (1)</h3>
                    <Card className="border-l-4 border-l-green-500 bg-green-50/50">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">Room 101</CardTitle>
                                <Badge variant="outline">#1020</Badge>
                            </div>
                            <p className="text-xs text-green-600 font-bold">Waiting Pickup (4m)</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm opacity-50">
                                <div className="flex justify-between font-medium underline">
                                    <span>1x Pizza</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusChange('#1020', 'Served')}>Served</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
