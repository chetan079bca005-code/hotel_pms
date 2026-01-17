/**
 * Hotel PMS - Order Tracking Page
 * Real-time order status tracking
 */

import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  ChefHat,
  UtensilsCrossed,
  Check,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/common';
import { cn } from '@/lib/utils';

/**
 * Order status type
 */
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

/**
 * Order status config
 */
const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
  confirmed: { label: 'Confirmed', icon: Check, color: 'text-blue-500' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'text-orange-500' },
  ready: { label: 'Ready', icon: UtensilsCrossed, color: 'text-purple-500' },
  delivered: { label: 'Delivered', icon: Check, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: Clock, color: 'text-red-500' },
};

/**
 * Order steps
 */
const orderSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

/**
 * Mock order data
 */
const mockOrder = {
  id: 'ORD12345678',
  reference: 'ORD12345678',
  status: 'preparing' as OrderStatus,
  placedAt: '2024-01-20T14:30:00',
  estimatedTime: 25,
  deliveryType: 'room',
  roomNumber: '305',
  items: [
    { id: '1', name: 'Dal Bhat Set', quantity: 1, price: 350 },
    { id: '2', name: 'Momo (Chicken)', quantity: 2, price: 280 },
    { id: '10', name: 'Masala Tea', quantity: 2, price: 80 },
  ],
  subtotal: 990,
  serviceCharge: 99,
  total: 1089,
  paymentMethod: 'esewa',
  paymentStatus: 'paid',
  specialInstructions: 'Extra chutney please',
};

/**
 * OrderTrackingPage component
 */
export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  
  // State
  const [order, setOrder] = React.useState(mockOrder);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      // In real app, fetch order status from API
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [orderId]);
  
  // Calculate progress
  const currentStepIndex = orderSteps.indexOf(order.status);
  const progressPercentage = order.status === 'cancelled' 
    ? 0 
    : ((currentStepIndex + 1) / orderSteps.length) * 100;
  
  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Calculate elapsed time
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(order.placedAt).getTime()) / (1000 * 60)
  );
  
  // Refresh order
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, fetch updated order status
    setIsRefreshing(false);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/menu">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">Order #{order.reference}</h1>
                <p className="text-sm text-muted-foreground">
                  Placed at {formatTime(order.placedAt)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Card */}
          <Card>
            <CardContent className="pt-6">
              {/* Current Status */}
              <div className="text-center mb-8">
                <div className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                  order.status === 'delivered' ? 'bg-green-100' : 'bg-primary/10'
                )}>
                  {React.createElement(statusConfig[order.status].icon, {
                    className: cn('h-10 w-10', statusConfig[order.status].color),
                  })}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {statusConfig[order.status].label}
                </h2>
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <p className="text-muted-foreground">
                    Estimated time: {Math.max(0, order.estimatedTime - elapsedMinutes)} minutes
                  </p>
                )}
                {order.status === 'delivered' && (
                  <p className="text-green-600">Your order has been delivered!</p>
                )}
              </div>

              {/* Progress Bar */}
              <Progress value={progressPercentage} className="h-2 mb-8" />

              {/* Status Steps */}
              <div className="flex justify-between">
                {orderSteps.map((step, index) => {
                  const isCompleted = currentStepIndex > index;
                  const isCurrent = currentStepIndex === index;
                  const StepIcon = statusConfig[step].icon;
                  
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                          isCompleted || isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-xs text-center',
                          (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {statusConfig[step].label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {order.deliveryType === 'room' ? 'Room Delivery' : 
                     order.deliveryType === 'table' ? 'Table Service' : 'Takeaway'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryType === 'room' && `Room ${order.roomNumber}`}
                    {order.deliveryType === 'table' && `Table ${order.roomNumber}`}
                    {order.deliveryType === 'takeaway' && 'Pick up at restaurant counter'}
                  </p>
                </div>
              </div>
              
              {order.specialInstructions && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Special Instructions</p>
                    <p className="text-sm text-muted-foreground">
                      {order.specialInstructions}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>NPR {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Service charge</span>
                  <span>NPR {order.serviceCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>NPR {order.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Restaurant
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Support
            </Button>
          </div>

          {/* Rate Order (if delivered) */}
          {order.status === 'delivered' && (
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold mb-2">How was your order?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your feedback helps us improve
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button key={rating} variant="outline" size="icon" className="h-10 w-10">
                      <Star className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order Again */}
          <div className="text-center">
            <Button asChild>
              <Link to="/menu">Order Again</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
