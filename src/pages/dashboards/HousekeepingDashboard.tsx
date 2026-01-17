import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, AlertCircle, CheckCircle2, Clock, Filter, User, BedDouble } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function HousekeepingDashboard() {
    const { toast } = useToast();

    const handleAssignTasks = () => {
        toast({
            title: "Task Assignment",
            description: "Opening task assignment interface...",
        });
    };

    const handleReportIssue = () => {
        toast({
            title: "Report Issue",
            description: "Opening maintenance request form...",
        });
    };

    const handleRoomClick = (roomNumber: string) => {
        toast({
            title: `Room ${roomNumber}`,
            description: "Showing room details and cleaning history.",
        });
    };

    const handleFilter = () => {
        toast({
            title: "Filters Applied",
            description: "Showing filtered room list.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Housekeeping</h1>
                    <p className="text-muted-foreground">Today's cleaning schedule</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReportIssue}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Report Issue
                    </Button>
                    <Button onClick={handleAssignTasks}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Assign Tasks
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">To Clean</CardTitle>
                        <BedDouble className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <Progress value={33} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">4 high priority</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground mt-2">AVG time: 25 mins</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ready</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">38</div>
                        <p className="text-xs text-muted-foreground mt-2">Ready for check-in</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Room Status Grid</CardTitle>
                            <CardDescription>Live status of all rooms</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleFilter}>
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[
                            { number: '101', status: 'clean', assignee: '' },
                            { number: '102', status: 'dirty', assignee: 'Jane' },
                            { number: '103', status: 'cleaning', assignee: 'Sarah' },
                            { number: '104', status: 'clean', assignee: '' },
                            { number: '105', status: 'dirty', assignee: 'Jane' },
                            { number: '201', status: 'maintenance', assignee: '' },
                            { number: '202', status: 'clean', assignee: '' },
                            { number: '203', status: 'cleaning', assignee: 'Mike' },
                            { number: '204', status: 'dirty', assignee: 'Mike' },
                            { number: '205', status: 'clean', assignee: '' },
                            { number: '301', status: 'clean', assignee: '' },
                            { number: '302', status: 'dirty', assignee: 'Sarah' },
                        ].map((room) => (
                            <div
                                key={room.number}
                                onClick={() => handleRoomClick(room.number)}
                                className={`
                                    p-3 rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:shadow-md
                                    ${room.status === 'clean' ? 'bg-green-50 border-green-200 dark:bg-green-950/30' : ''}
                                    ${room.status === 'dirty' ? 'bg-red-50 border-red-200 dark:bg-red-950/30' : ''}
                                    ${room.status === 'cleaning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30' : ''}
                                    ${room.status === 'maintenance' ? 'bg-gray-100 border-gray-200 dark:bg-gray-800' : ''}
                                `}
                            >
                                <span className="font-bold text-lg">{room.number}</span>
                                <Badge
                                    variant="secondary"
                                    className={`
                                        text-[10px] h-5 px-1
                                        ${room.status === 'clean' ? 'bg-green-200 text-green-800 hover:bg-green-300' : ''}
                                        ${room.status === 'dirty' ? 'bg-red-200 text-red-800 hover:bg-red-300' : ''}
                                        ${room.status === 'cleaning' ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' : ''}
                                    `}
                                >
                                    {room.status.toUpperCase()}
                                </Badge>
                                {room.assignee && (
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                        <User className="h-3 w-3" /> {room.assignee}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
