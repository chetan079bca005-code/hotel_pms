/**
 * Hotel PMS - Admin Payments Page
 * Payment records and financial management
 */

import * as React from 'react';
import {
  Search,
  Filter,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuSeparator,
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

/**
 * Payment status type
 */
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

/**
 * Payment method type
 */
type PaymentMethod = 'esewa' | 'khalti' | 'card' | 'cash' | 'room-charge';

/**
 * Payment interface
 */
interface Payment {
  id: string;
  transactionId: string;
  guestName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  type: 'booking' | 'restaurant' | 'service';
  referenceNumber?: string;
  bookingId?: string;
  orderId?: string;
  createdAt: string;
}

/**
 * Status configuration
 */
const statusConfig: Record<PaymentStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive'; icon: React.ElementType }> = {
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  failed: { label: 'Failed', variant: 'destructive', icon: XCircle },
  refunded: { label: 'Refunded', variant: 'default', icon: RefreshCw },
};

/**
 * Payment method configuration
 */
const methodConfig: Record<PaymentMethod, { label: string; icon: string; color: string }> = {
  esewa: { label: 'eSewa', icon: 'eSewa', color: 'bg-green-100 text-green-700' },
  khalti: { label: 'Khalti', icon: 'K', color: 'bg-purple-100 text-purple-700' },
  card: { label: 'Card', icon: '💳', color: 'bg-blue-100 text-blue-700' },
  cash: { label: 'Cash', icon: '💵', color: 'bg-gray-100 text-gray-700' },
  'room-charge': { label: 'Room Charge', icon: '🏨', color: 'bg-yellow-100 text-yellow-700' },
};

/**
 * Mock payments data
 */
const paymentsData: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-2024011801',
    guestName: 'Ramesh Sharma',
    amount: 15500,
    method: 'esewa',
    status: 'completed',
    type: 'booking',
    referenceNumber: 'ESW123456789',
    bookingId: 'BK-2024-001',
    createdAt: '2024-01-18T10:30:00',
  },
  {
    id: '2',
    transactionId: 'TXN-2024011802',
    guestName: 'Sarah Johnson',
    amount: 2450,
    method: 'khalti',
    status: 'completed',
    type: 'restaurant',
    referenceNumber: 'KHL987654321',
    orderId: 'ORD-2024-045',
    createdAt: '2024-01-18T09:15:00',
  },
  {
    id: '3',
    transactionId: 'TXN-2024011803',
    guestName: 'Priya Patel',
    amount: 35000,
    method: 'card',
    status: 'pending',
    type: 'booking',
    bookingId: 'BK-2024-003',
    createdAt: '2024-01-18T08:45:00',
  },
  {
    id: '4',
    transactionId: 'TXN-2024011804',
    guestName: 'John Smith',
    amount: 5200,
    method: 'room-charge',
    status: 'completed',
    type: 'restaurant',
    orderId: 'ORD-2024-044',
    createdAt: '2024-01-17T20:30:00',
  },
  {
    id: '5',
    transactionId: 'TXN-2024011805',
    guestName: 'Anita Gurung',
    amount: 12000,
    method: 'cash',
    status: 'completed',
    type: 'booking',
    bookingId: 'BK-2024-004',
    createdAt: '2024-01-17T16:00:00',
  },
  {
    id: '6',
    transactionId: 'TXN-2024011806',
    guestName: 'David Wilson',
    amount: 28500,
    method: 'card',
    status: 'failed',
    type: 'booking',
    bookingId: 'BK-2024-005',
    createdAt: '2024-01-17T14:20:00',
  },
  {
    id: '7',
    transactionId: 'TXN-2024011807',
    guestName: 'Emma Brown',
    amount: 8500,
    method: 'esewa',
    status: 'refunded',
    type: 'booking',
    referenceNumber: 'ESW555666777',
    bookingId: 'BK-2024-006',
    createdAt: '2024-01-17T11:10:00',
  },
];

/**
 * AdminPaymentsPage component
 */
export default function AdminPaymentsPage() {
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [methodFilter, setMethodFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Filter payments
  const filteredPayments = React.useMemo(() => {
    return paymentsData.filter((payment) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !payment.guestName.toLowerCase().includes(search) &&
          !payment.transactionId.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      
      if (statusFilter !== 'all' && payment.status !== statusFilter) {
        return false;
      }
      
      if (methodFilter !== 'all' && payment.method !== methodFilter) {
        return false;
      }
      
      if (typeFilter !== 'all' && payment.type !== typeFilter) {
        return false;
      }
      
      return true;
    });
  }, [debouncedSearch, statusFilter, methodFilter, typeFilter]);
  
  // Calculate stats
  const stats = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = paymentsData.filter((p) => 
      p.createdAt.startsWith(today) && p.status === 'completed'
    );
    const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const totalCompleted = paymentsData
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingAmount = paymentsData
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const refundedAmount = paymentsData
      .filter((p) => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      todayTotal,
      todayCount: todayPayments.length,
      totalCompleted,
      pendingAmount,
      pendingCount: paymentsData.filter((p) => p.status === 'pending').length,
      refundedAmount,
    };
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="View and manage payment transactions"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="success" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(stats.todayTotal)}</p>
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(stats.totalCompleted)}</p>
              <p className="text-sm text-muted-foreground">Total Received</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn(stats.pendingCount > 0 && 'border-yellow-200')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              {stats.pendingCount > 0 && (
                <Badge variant="warning">{stats.pendingCount} pending</Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</p>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(stats.refundedAmount)}</p>
              <p className="text-sm text-muted-foreground">Total Refunds</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="esewa">eSewa</SelectItem>
                <SelectItem value="khalti">Khalti</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="room-charge">Room Charge</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Date range"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12">
                    <EmptyState
                      icon={CreditCard}
                      title="No payments found"
                      description="No payments match your current filters"
                      action={{
                        label: 'Clear Filters',
                        onClick: () => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setMethodFilter('all');
                          setTypeFilter('all');
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const status = statusConfig[payment.status];
                  const method = methodConfig[payment.method];
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium font-mono text-sm">{payment.transactionId}</p>
                          {payment.referenceNumber && (
                            <p className="text-xs text-muted-foreground">
                              Ref: {payment.referenceNumber}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{payment.guestName}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('font-normal', method.color)}>
                          {method.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{payment.type}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(payment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                            {payment.status === 'completed' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Issue Refund
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>
                  Transaction {selectedPayment.transactionId}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(selectedPayment.amount)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusConfig[selectedPayment.status].variant} className="mt-1">
                      {statusConfig[selectedPayment.status].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <Badge className={cn('mt-1', methodConfig[selectedPayment.method].color)}>
                      {methodConfig[selectedPayment.method].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest</p>
                    <p className="font-medium">{selectedPayment.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedPayment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">{formatDateTime(selectedPayment.createdAt)}</p>
                  </div>
                  {selectedPayment.referenceNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Reference</p>
                      <p className="font-medium font-mono text-sm">{selectedPayment.referenceNumber}</p>
                    </div>
                  )}
                  {selectedPayment.bookingId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-medium">{selectedPayment.bookingId}</p>
                    </div>
                  )}
                  {selectedPayment.orderId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-medium">{selectedPayment.orderId}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  {selectedPayment.status === 'completed' && (
                    <Button variant="destructive" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Issue Refund
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
