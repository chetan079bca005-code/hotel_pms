import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, BarChart, Calendar, ArrowUpRight, ArrowDownRight, CreditCard, Users, LucideIcon } from 'lucide-react';
import { mockRevenueStats, mockRevenueOverview, mockRecentTransactions } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function RevenueDashboard() {
    const { toast } = useToast();

    // Icon mapping
    const iconMap: Record<string, LucideIcon> = {
        'DollarSign': DollarSign,
        'TrendingUp': TrendingUp,
        'BarChart': BarChart,
        'Users': Users,
    };

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
                {mockRevenueStats.map((stat) => {
                    const Icon = iconMap[stat.iconName] || DollarSign;
                    const isPositive = stat.changeType === 'positive';
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} mt-1`}>
                                    {isPositive ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    {stat.change} {stat.subtext}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue breakdown by source</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-muted/10 rounded-lg flex items-end justify-between p-4 gap-2">
                            {/* Chart Bars from Mock Data */}
                            {mockRevenueOverview.map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => toast({ title: `Revenue for ${item.month}`, description: `$${item.value},000 generated.` })}>
                                    <div
                                        className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-sm relative"
                                        style={{ height: `${item.value}%` }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            ${item.value}k
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{item.month}</span>
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
                            {mockRecentTransactions.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer" onClick={() => toast({ title: "Transaction Details", description: `Transaction ID: #TXN-20${item.id}` })}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{item.guest}</p>
                                            <p className="text-xs text-muted-foreground">{item.room}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{item.amount}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.method}</p>
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
