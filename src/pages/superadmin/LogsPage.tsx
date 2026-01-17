/**
 * Hotel PMS - Super Admin Activity Logs Page
 * System-wide activity and audit logs using centralized mock data
 */

import * as React from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  MoreVertical,
  Eye,
  User,
  Building2,
  Settings,
  Shield,
  CreditCard,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DateRangePicker } from '@/components/ui/date-picker';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  mockAuditLogs,
  logLevelConfig,
  logCategoryConfig,
  type AuditLog,
  type LogLevel,
  type LogCategory,
} from '@/data/mockData';
import { activityDataService } from '@/services/dataService';

/**
 * Logs loading skeleton
 */
function LogsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * SuperAdminLogsPage component
 */
export default function SuperAdminLogsPage() {
  // State
  const [logs, setLogs] = React.useState<AuditLog[]>(mockAuditLogs);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [levelFilter, setLevelFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load data
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await activityDataService.getAuditLogs();
        setLogs(data);
      } catch (error) {
        console.error('Failed to load logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await activityDataService.getAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to refresh logs:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch =
          log.action.toLowerCase().includes(searchLower) ||
          log.description.toLowerCase().includes(searchLower) ||
          log.user.name.toLowerCase().includes(searchLower) ||
          log.user.email.toLowerCase().includes(searchLower) ||
          (log.hotel && log.hotel.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Level filter
      if (levelFilter !== 'all' && log.level !== levelFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;

      // Date range filter
      if (dateRange.from) {
        const logDate = new Date(log.timestamp);
        if (logDate < dateRange.from) return false;
        if (dateRange.to && logDate > dateRange.to) return false;
      }

      return true;
    });
  }, [logs, debouncedSearch, levelFilter, categoryFilter, dateRange]);

  // View log details
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Export logs
  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Level', 'Category', 'Action', 'Description', 'User', 'Email', 'Hotel', 'IP Address'].join(','),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.level,
          log.category,
          log.action,
          `"${log.description}"`,
          log.user.name,
          log.user.email,
          log.hotel || '',
          log.ipAddress,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Log stats
  const logStats = React.useMemo(() => {
    return {
      total: logs.length,
      errors: logs.filter((l) => l.level === 'error').length,
      warnings: logs.filter((l) => l.level === 'warning').length,
      info: logs.filter((l) => l.level === 'info').length,
    };
  }, [logs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="System-wide activity and audit logs"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logStats.errors}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logStats.warnings}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logStats.info}</p>
                <p className="text-sm text-muted-foreground">Info Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LogsSkeleton />
          ) : filteredLogs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No logs found"
              description="No logs match your current filters."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const levelInfo = logLevelConfig[log.level as LogLevel];
                  const categoryInfo = logCategoryConfig[log.category as LogCategory];
                  const LevelIcon = levelInfo?.icon || Info;
                  const CategoryIcon = categoryInfo?.icon || Settings;

                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={levelInfo?.variant || 'default'} className="gap-1">
                          <LevelIcon className="h-3 w-3" />
                          {levelInfo?.label || log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className={cn("h-4 w-4", categoryInfo?.color)} />
                          <span className="text-sm">{categoryInfo?.label || log.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {log.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{log.user.name}</p>
                            <p className="text-xs text-muted-foreground">{log.user.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(log)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>
              Full details of the activity log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <Badge variant={logLevelConfig[selectedLog.level as LogLevel]?.variant || 'default'}>
                    {selectedLog.level}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{logCategoryConfig[selectedLog.category as LogCategory]?.label || selectedLog.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Action</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{selectedLog.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{selectedLog.user.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedLog.user.role}</p>
                </div>
              </div>
              {selectedLog.hotel && (
                <div>
                  <p className="text-sm text-muted-foreground">Hotel</p>
                  <p className="font-medium">{selectedLog.hotel}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Agent</p>
                  <p className="text-sm truncate">{selectedLog.userAgent}</p>
                </div>
              </div>
              {selectedLog.metadata && (
                <div>
                  <p className="text-sm text-muted-foreground">Metadata</p>
                  <pre className="mt-1 p-3 bg-muted rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
