import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, BarChart, Calendar, ArrowUpRight, ArrowDownRight, CreditCard, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function RevenueDashboard() {
    const { toast } = useToast();

    const handleExport = () => {
        toast({
            title: "Report Exported",
            description: "Revenue_Report_2024.pdf has been downloaded.",
        });
    };

    const handleRangeChange = () => {
        toast({
            title: "Date Range Updated",
            description: "Showing data for Custom Range.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
                <div className="flex items-center gap-2">
                    <Tabs defaultValue="month" className="h-9">
                        <TabsList>
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button variant="outline" onClick={handleRangeChange}><Calendar className="h-4 w-4 mr-2" />Custom Range</Button>
                    <Button onClick={handleExport}>Export Report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +15% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$85.00</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +5% vs target
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ADR</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$105.00</div>
                        <div className="flex items-center text-xs text-red-500 mt-1">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            -2% vs last week
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">82%</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +12% yoy
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue breakdown by source</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-muted/10 rounded-lg flex items-end justify-between p-4 gap-2">
                            {/* Fake Chart Bars */}
                            {[40, 60, 45, 70, 80, 55, 65, 85, 90, 75, 60, 95].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => toast({ title: `Revenue for ${['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}`, description: `$${h},000 generated.` })}>
                                    <div
                                        className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-sm relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            ${h}k
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>Recent payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer" onClick={() => toast({ title: "Transaction Details", description: `Transaction ID: #TXN-20${i}` })}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Guest #10{i}</p>
                                            <p className="text-xs text-muted-foreground">Room 20{i}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">+$120.00</p>
                                        <p className="text-[10px] text-muted-foreground">Credit Card</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
