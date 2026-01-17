/**
 * Hotel PMS - Menu Orders Page
 * View all menu orders history
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  ChefHat,
  Check,
  X,
  ChevronRight,
  Filter,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/common';
import { cn } from '@/lib/utils';

/**
 * Order status type
 */
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

/**
 * Order interface
 */
interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  placedAt: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  deliveryType: 'room' | 'table' | 'takeaway';
  location: string;
}

/**
 * Status badge config
 */
const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  preparing: { label: 'Preparing', variant: 'default' },
  ready: { label: 'Ready', variant: 'secondary' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

/**
 * Mock orders data
 */
const ordersData: Order[] = [
  {
    id: '1',
    reference: 'ORD12345678',
    status: 'preparing',
    placedAt: '2024-01-20T14:30:00',
    items: [
      { name: 'Dal Bhat Set', quantity: 1 },
      { name: 'Momo (Chicken)', quantity: 2 },
      { name: 'Masala Tea', quantity: 2 },
    ],
    total: 1089,
    deliveryType: 'room',
    location: 'Room 305',
  },
  {
    id: '2',
    reference: 'ORD87654321',
    status: 'delivered',
    placedAt: '2024-01-19T12:15:00',
    items: [
      { name: 'Butter Chicken', quantity: 1 },
      { name: 'Naan', quantity: 2 },
    ],
    total: 650,
    deliveryType: 'table',
    location: 'Table 5',
  },
  {
    id: '3',
    reference: 'ORD11223344',
    status: 'delivered',
    placedAt: '2024-01-18T19:45:00',
    items: [
      { name: 'Grilled Salmon', quantity: 1 },
      { name: 'Fresh Lime Soda', quantity: 1 },
    ],
    total: 1067,
    deliveryType: 'room',
    location: 'Room 305',
  },
  {
    id: '4',
    reference: 'ORD55667788',
    status: 'cancelled',
    placedAt: '2024-01-17T11:00:00',
    items: [
      { name: 'English Breakfast', quantity: 1 },
    ],
    total: 605,
    deliveryType: 'room',
    location: 'Room 305',
  },
];

/**
 * OrdersPage component
 */
export default function OrdersPage() {
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('date-desc');
  
  // Filter orders
  const filterOrders = (status: OrderStatus | 'all') => {
    let filtered = ordersData;
    
    if (status !== 'all') {
      filtered = filtered.filter((o) => o.status === status);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((o) =>
        o.reference.toLowerCase().includes(query) ||
        o.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime();
        case 'date-desc':
          return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
        case 'amount-desc':
          return b.total - a.total;
        case 'amount-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });
    
    return filtered;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Render order card
  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-medium">{order.reference}</span>
              <Badge variant={statusConfig[order.status].variant}>
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.placedAt)}
            </p>
          </div>
          <p className="font-bold">NPR {order.total.toLocaleString()}</p>
        </div>
        
        {/* Items */}
        <div className="mb-3">
          <p className="text-sm">
            {order.items.map((item, idx) => (
              <span key={idx}>
                {item.name} × {item.quantity}
                {idx < order.items.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
        
        {/* Delivery Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {order.deliveryType === 'room' && '🏨 '}
            {order.deliveryType === 'table' && '🍽️ '}
            {order.deliveryType === 'takeaway' && '🥡 '}
            {order.location}
          </p>
          
          <div className="flex gap-2">
            {(order.status === 'pending' || order.status === 'preparing' || order.status === 'ready') && (
              <Button size="sm" asChild>
                <Link to={`/menu/orders/${order.reference}`}>
                  Track Order
                </Link>
              </Button>
            )}
            {order.status === 'delivered' && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/menu?reorder=${order.id}`}>
                  Reorder
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link to={`/menu/orders/${order.reference}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Active orders count
  const activeCount = ordersData.filter(
    (o) => ['pending', 'preparing', 'ready'].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-sm text-muted-foreground">
                Track and view your order history
              </p>
            </div>
            <Button asChild>
              <Link to="/menu" className="inline-flex items-center">
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                <span>Order Food</span>
              </Link>
            </Button>
          </div>
          
          {/* Search and Sort */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="all">
              All ({ordersData.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeCount})
              {activeCount > 0 && (
                <span className="ml-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered ({ordersData.filter((o) => o.status === 'delivered').length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({ordersData.filter((o) => o.status === 'cancelled').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filterOrders('all').length > 0 ? (
              filterOrders('all').map(renderOrderCard)
            ) : (
              <EmptyState
                variant="orders"
                title="No orders yet"
                description="Start exploring our menu and place your first order"
                action={
                  <Button asChild>
                    <Link to="/menu">Browse Menu</Link>
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filterOrders('all').filter((o) => 
              ['pending', 'preparing', 'ready'].includes(o.status)
            ).length > 0 ? (
              filterOrders('all')
                .filter((o) => ['pending', 'preparing', 'ready'].includes(o.status))
                .map(renderOrderCard)
            ) : (
              <EmptyState
                icon={<ChefHat className="h-12 w-12" />}
                title="No active orders"
                description="You don't have any orders being prepared"
                action={
                  <Button asChild>
                    <Link to="/menu">Order Now</Link>
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {filterOrders('delivered').length > 0 ? (
              filterOrders('delivered').map(renderOrderCard)
            ) : (
              <EmptyState
                icon={<Check className="h-12 w-12" />}
                title="No delivered orders"
                description="Your completed orders will appear here"
              />
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterOrders('cancelled').length > 0 ? (
              filterOrders('cancelled').map(renderOrderCard)
            ) : (
              <EmptyState
                icon={<X className="h-12 w-12" />}
                title="No cancelled orders"
                description="Cancelled orders will appear here"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
