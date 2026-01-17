/**
 * Hotel PMS - Admin Orders Management Page
 * Manage restaurant orders and kitchen operations
 */

import * as React from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  ChefHat,
  Truck,
  XCircle,
  BedDouble,
  Users,
  Package,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/**
 * Order status type
 */
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

/**
 * Order delivery type
 */
type DeliveryType = 'room' | 'table' | 'takeaway';

/**
 * Order item interface
 */
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

/**
 * Order interface
 */
interface Order {
  id: string;
  reference: string;
  items: OrderItem[];
  deliveryType: DeliveryType;
  location: string;
  guestName: string;
  guestPhone?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  estimatedDelivery?: string;
  notes?: string;
}

/**
 * Status badge config
 */
const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'; icon: React.ElementType }> = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  confirmed: { label: 'Confirmed', variant: 'default', icon: CheckCircle },
  preparing: { label: 'Preparing', variant: 'default', icon: ChefHat },
  ready: { label: 'Ready', variant: 'success', icon: Package },
  delivered: { label: 'Delivered', variant: 'secondary', icon: Truck },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
};

/**
 * Delivery type config
 */
const deliveryTypeConfig: Record<DeliveryType, { label: string; icon: React.ElementType }> = {
  room: { label: 'Room Service', icon: BedDouble },
  table: { label: 'Table', icon: Users },
  takeaway: { label: 'Takeaway', icon: Package },
};

/**
 * Mock orders data
 */
const ordersData: Order[] = [
  {
    id: '1',
    reference: 'ORD001',
    items: [
      { id: '1', name: 'Dal Bhat Set', quantity: 1, price: 350 },
      { id: '2', name: 'Momo (Chicken)', quantity: 2, price: 280, specialInstructions: 'Extra spicy' },
    ],
    deliveryType: 'room',
    location: 'Room 305',
    guestName: 'Ramesh Sharma',
    guestPhone: '+977 9841234567',
    totalAmount: 910,
    status: 'preparing',
    paymentMethod: 'Room Charge',
    isPaid: false,
    createdAt: '2024-01-20T12:30:00',
    estimatedDelivery: '12:55',
    notes: 'Guest prefers hot food',
  },
  {
    id: '2',
    reference: 'ORD002',
    items: [
      { id: '3', name: 'Butter Chicken', quantity: 1, price: 450 },
      { id: '4', name: 'Naan', quantity: 2, price: 100 },
    ],
    deliveryType: 'room',
    location: 'Room 201',
    guestName: 'Sarah Johnson',
    totalAmount: 650,
    status: 'pending',
    paymentMethod: 'Card',
    isPaid: true,
    createdAt: '2024-01-20T12:35:00',
    estimatedDelivery: '13:05',
  },
  {
    id: '3',
    reference: 'ORD003',
    items: [
      { id: '5', name: 'English Breakfast', quantity: 1, price: 550 },
    ],
    deliveryType: 'table',
    location: 'Table 5',
    guestName: 'Walk-in Guest',
    totalAmount: 550,
    status: 'ready',
    paymentMethod: 'Cash',
    isPaid: false,
    createdAt: '2024-01-20T12:20:00',
  },
  {
    id: '4',
    reference: 'ORD004',
    items: [
      { id: '6', name: 'Grilled Chicken', quantity: 2, price: 650 },
      { id: '7', name: 'Caesar Salad', quantity: 1, price: 350 },
      { id: '8', name: 'Fresh Juice', quantity: 2, price: 150 },
    ],
    deliveryType: 'room',
    location: 'Room 401',
    guestName: 'John Smith',
    totalAmount: 1950,
    status: 'confirmed',
    paymentMethod: 'Room Charge',
    isPaid: false,
    createdAt: '2024-01-20T12:40:00',
    estimatedDelivery: '13:10',
  },
  {
    id: '5',
    reference: 'ORD005',
    items: [
      { id: '9', name: 'Momo (Veg)', quantity: 1, price: 250 },
    ],
    deliveryType: 'takeaway',
    location: 'Counter',
    guestName: 'Priya Patel',
    totalAmount: 250,
    status: 'delivered',
    paymentMethod: 'eSewa',
    isPaid: true,
    createdAt: '2024-01-20T11:30:00',
  },
];

/**
 * AdminOrdersPage component
 */
export default function AdminOrdersPage() {
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = React.useState<string>('all');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = React.useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Action Handlers (Demo Mode)
  const handleRefresh = () => {
    toast({ title: 'Refreshed', description: 'Order list updated from server.' });
  };

  const handleAcceptOrder = (ref: string) => {
    toast({ title: 'Order Accepted', description: `Order ${ref} has been confirmed.` });
    setSelectedOrder(null);
  };

  const handleStartOrder = (ref: string) => {
    toast({ title: 'Preparation Started', description: `Order ${ref} is now being prepared.` });
    setSelectedOrder(null);
  };

  const handleReadyOrder = (ref: string) => {
    toast({ title: 'Order Ready', description: `Order ${ref} is ready for pickup/delivery.` });
    setSelectedOrder(null);
  };

  const handleDeliverOrder = (ref: string) => {
    toast({ title: 'Order Delivered', description: `Order ${ref} has been delivered.` });
    setSelectedOrder(null);
  };

  const handleCancelOrder = (ref: string) => {
    toast({ variant: 'destructive', title: 'Order Cancelled', description: `Order ${ref} has been cancelled.` });
    setSelectedOrder(null);
  };

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    return ordersData.filter((order) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !order.reference.toLowerCase().includes(search) &&
          !order.guestName.toLowerCase().includes(search) &&
          !order.location.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      if (deliveryFilter !== 'all' && order.deliveryType !== deliveryFilter) {
        return false;
      }

      return true;
    });
  }, [debouncedSearch, statusFilter, deliveryFilter]);

  // Active orders (pending, confirmed, preparing, ready)
  const activeOrders = ordersData.filter((o) =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  );

  // Stats
  const stats = {
    total: ordersData.length,
    pending: ordersData.filter((o) => o.status === 'pending').length,
    preparing: ordersData.filter((o) => o.status === 'preparing').length,
    ready: ordersData.filter((o) => o.status === 'ready').length,
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders Management"
        description="Manage restaurant orders and kitchen operations"
        actions={
          <div className="flex gap-3">
            <Button
              variant={isAutoRefresh ? 'default' : 'outline'}
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            >
              {isAutoRefresh ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Auto-refresh ON
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Auto-refresh OFF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
                <p className="text-sm text-yellow-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700">{stats.preparing}</p>
                <p className="text-sm text-blue-600">Preparing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-700">{stats.ready}</p>
                <p className="text-sm text-green-600">Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kitchen View - Active Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Kitchen Queue
            </CardTitle>
            <CardDescription>
              {activeOrders.length} active orders
            </CardDescription>
          </div>
          {isAutoRefresh && (
            <Badge variant="outline" className="animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Live
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {activeOrders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const DeliveryIcon = deliveryTypeConfig[order.deliveryType].icon;

                return (
                  <Card
                    key={order.id}
                    className={cn(
                      'cursor-pointer hover:shadow-md transition-shadow',
                      order.status === 'pending' && 'border-yellow-400 bg-yellow-50/50',
                      order.status === 'preparing' && 'border-blue-400 bg-blue-50/50',
                      order.status === 'ready' && 'border-green-400 bg-green-50/50'
                    )}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono font-bold">{order.reference}</span>
                        <Badge variant={statusConfig[order.status].variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-3" />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DeliveryIcon className="h-4 w-4" />
                          {order.location}
                        </div>
                        <span className="text-muted-foreground">
                          {getTimeAgo(order.createdAt)}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        {order.status === 'pending' && (
                          <Button size="sm" className="flex-1" onClick={() => handleAcceptOrder(order.reference)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button size="sm" className="flex-1" onClick={() => handleStartOrder(order.reference)}>
                            <ChefHat className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button size="sm" className="flex-1" variant="success" onClick={() => handleReadyOrder(order.reference)}>
                            <Package className="h-4 w-4 mr-1" />
                            Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button size="sm" className="flex-1" onClick={() => handleDeliverOrder(order.reference)}>
                            <Truck className="h-4 w-4 mr-1" />
                            Deliver
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active orders</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Complete order history</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Delivery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="room">Room Service</SelectItem>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="takeaway">Takeaway</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const DeliveryIcon = deliveryTypeConfig[order.deliveryType].icon;

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className="font-mono font-medium">{order.reference}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="truncate max-w-[150px]">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-muted-foreground">
                            +{order.items.length - 2} more
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DeliveryIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{order.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.guestName}</p>
                        {order.guestPhone && (
                          <p className="text-xs text-muted-foreground">{order.guestPhone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">NPR {order.totalAmount.toLocaleString()}</p>
                        <Badge variant={order.isPaid ? 'success' : 'secondary'} className="text-xs">
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[order.status].variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatTime(order.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(order.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <DropdownMenuItem className="text-destructive" onClick={() => handleCancelOrder(order.reference)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Order {selectedOrder.reference}</span>
                  <Badge variant={statusConfig[selectedOrder.status].variant}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {formatTime(selectedOrder.createdAt)} • {selectedOrder.guestName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Delivery Info */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    {React.createElement(deliveryTypeConfig[selectedOrder.deliveryType].icon, {
                      className: 'h-5 w-5',
                    })}
                    <div>
                      <p className="font-medium">
                        {deliveryTypeConfig[selectedOrder.deliveryType].label}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.location}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h4 className="font-medium">Items</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div>
                        <p>{item.quantity}x {item.name}</p>
                        {item.specialInstructions && (
                          <p className="text-xs text-muted-foreground">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>NPR {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex items-center justify-between text-sm">
                  <span>Payment: {selectedOrder.paymentMethod}</span>
                  <Badge variant={selectedOrder.isPaid ? 'success' : 'warning'}>
                    {selectedOrder.isPaid ? 'Paid' : 'Payment Pending'}
                  </Badge>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                    <p className="font-medium text-yellow-800">Notes:</p>
                    <p className="text-yellow-700">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button className="flex-1" onClick={() => handleAcceptOrder(selectedOrder.reference)}>Accept Order</Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleCancelOrder(selectedOrder.reference)}>Reject</Button>
                    </>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <Button className="flex-1" onClick={() => handleStartOrder(selectedOrder.reference)}>Start Preparing</Button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <Button className="flex-1" variant="success" onClick={() => handleReadyOrder(selectedOrder.reference)}>Mark Ready</Button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <Button className="flex-1" onClick={() => handleDeliverOrder(selectedOrder.reference)}>Mark Delivered</Button>
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
