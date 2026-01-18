/**
 * Hotel PMS - Admin Bookings Management Page
 * Manage all room bookings
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BedDouble,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-picker';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import {
  mockBookings,
  Booking,
  BookingStatus
} from '@/data/mockData';


/**
 * Status badge config
 */
const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  'checked-in': { label: 'Checked In', variant: 'success' },
  'checked-out': { label: 'Checked Out', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  'no-show': { label: 'No Show', variant: 'destructive' },
};

const bookingsData = mockBookings;

/**
 * AdminBookingsPage component
 */
export default function AdminBookingsPage() {
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selectedBookings, setSelectedBookings] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Action Handlers (Demo Mode)
  const handleExport = () => {
    toast({ title: 'Exporting Bookings', description: 'Bookings_Report.pdf is being generated...' });
  };

  const handleNewBooking = () => {
    toast({ title: 'New Booking', description: 'Opening new booking form... (Demo Mode - use the booking flow from Dashboard)' });
  };

  const handleCheckIn = (ref: string) => {
    toast({ title: 'Guest Checked In', description: `Booking ${ref} has been checked in.` });
  };

  const handleCheckOut = (ref: string) => {
    toast({ title: 'Guest Checked Out', description: `Booking ${ref} has been checked out.` });
  };

  const handleCancel = (ref: string) => {
    toast({ variant: 'destructive', title: 'Booking Cancelled', description: `Booking ${ref} has been cancelled.` });
  };

  const handleBulkExport = () => {
    toast({ title: 'Bulk Export', description: `${selectedBookings.length} bookings exported.` });
    setSelectedBookings([]);
  };

  const handleBulkCancel = () => {
    toast({ variant: 'destructive', title: 'Bulk Cancellation', description: `${selectedBookings.length} bookings cancelled.` });
    setSelectedBookings([]);
  };

  // Filter bookings
  const filteredBookings = React.useMemo(() => {
    return bookingsData.filter((booking) => {
      // Search filter
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !booking.reference.toLowerCase().includes(search) &&
          !booking.guestName.toLowerCase().includes(search) &&
          !booking.guestEmail.toLowerCase().includes(search) &&
          !booking.roomNumber.includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from && new Date(booking.checkIn) < dateRange.from) {
        return false;
      }
      if (dateRange.to && new Date(booking.checkIn) > dateRange.to) {
        return false;
      }

      return true;
    });
  }, [debouncedSearch, statusFilter, dateRange]);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(filteredBookings.map((b) => b.id));
    } else {
      setSelectedBookings([]);
    }
  };

  // Handle single select
  const handleSelect = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, bookingId]);
    } else {
      setSelectedBookings(selectedBookings.filter((id) => id !== bookingId));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Stats
  const stats = {
    total: bookingsData.length,
    pending: bookingsData.filter((b) => b.status === 'pending').length,
    confirmed: bookingsData.filter((b) => b.status === 'confirmed').length,
    checkedIn: bookingsData.filter((b) => b.status === 'checked-in').length,
    checkedOut: bookingsData.filter((b) => b.status === 'checked-out').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings Management"
        description="View and manage all room reservations"
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleNewBooking}>
              <Plus className="h-4 w-4 mr-2" />
              <span>New Booking</span>
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BedDouble className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.checkedIn}</p>
                <p className="text-xs text-muted-foreground">Checked In</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.checkedOut}</p>
                <p className="text-xs text-muted-foreground">Checked Out</p>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference, guest name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Filter by date"
              className="w-full md:w-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in / Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBookings.includes(booking.id)}
                        onCheckedChange={(checked) => handleSelect(booking.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-medium">{booking.reference}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {booking.guestName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.roomName}</p>
                        <p className="text-xs text-muted-foreground">Room {booking.roomNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(booking.checkIn)}</p>
                        <p className="text-muted-foreground">{formatDate(booking.checkOut)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">NPR {booking.totalAmount.toLocaleString()}</p>
                        <Badge
                          variant={
                            booking.paymentStatus === 'paid'
                              ? 'success'
                              : booking.paymentStatus === 'partial'
                                ? 'warning'
                                : 'secondary'
                          }
                          className="mt-1"
                        >
                          {booking.paymentStatus === 'paid'
                            ? 'Paid'
                            : booking.paymentStatus === 'partial'
                              ? 'Partial'
                              : 'Pending'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[booking.status].variant}>
                        {statusConfig[booking.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/bookings/${booking.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/bookings/${booking.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {booking.status === 'confirmed' && (
                            <DropdownMenuItem onClick={() => handleCheckIn(booking.reference)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Check In
                            </DropdownMenuItem>
                          )}
                          {booking.status === 'checked-in' && (
                            <DropdownMenuItem onClick={() => handleCheckOut(booking.reference)}>
                              <BedDouble className="h-4 w-4 mr-2" />
                              Check Out
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleCancel(booking.reference)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <EmptyState
                      variant="bookings"
                      title="No bookings found"
                      description="Try adjusting your search or filters"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedBookings.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkExport}>
              Export Selected
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkCancel}>
              Cancel Selected
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedBookings([])}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
