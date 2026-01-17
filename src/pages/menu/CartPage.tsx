/**
 * Hotel PMS - Cart Page
 * Shopping cart and checkout for menu orders
 */

import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  Check,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common';
import { cn } from '@/lib/utils';

/**
 * Checkout form schema
 */
const checkoutSchema = z.object({
  deliveryType: z.enum(['room', 'table', 'takeaway']),
  roomNumber: z.string().optional(),
  tableNumber: z.string().optional(),
  specialInstructions: z.string().optional(),
  paymentMethod: z.enum(['esewa', 'khalti', 'card', 'cash', 'room-charge']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Payment methods
 */
const paymentMethods = [
  { id: 'esewa', name: 'eSewa', icon: '🟢', description: 'Pay with eSewa wallet' },
  { id: 'khalti', name: 'Khalti', icon: '🟣', description: 'Pay with Khalti wallet' },
  { id: 'card', name: 'Card', icon: '💳', description: 'Credit/Debit card' },
  { id: 'cash', name: 'Cash', icon: '💵', description: 'Pay on delivery' },
  { id: 'room-charge', name: 'Room Charge', icon: '🏨', description: 'Add to room bill' },
];

/**
 * CartPage component
 */
export default function CartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { items, removeItem, updateQuantity, clearCart, getCartTotal } = useCartStore();
  
  // Get context from URL (table/room scanning)
  const tableNumber = searchParams.get('table');
  const roomNumber = searchParams.get('room');
  
  // State
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [orderReference, setOrderReference] = React.useState('');
  
  // Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: roomNumber ? 'room' : tableNumber ? 'table' : 'room',
      roomNumber: roomNumber || '',
      tableNumber: tableNumber || '',
      specialInstructions: '',
      paymentMethod: 'esewa',
    },
  });
  
  const deliveryType = watch('deliveryType');
  const paymentMethod = watch('paymentMethod');
  
  // Calculate totals
  const subtotal = getCartTotal();
  const serviceCharge = Math.round(subtotal * 0.1);
  const total = subtotal + serviceCharge;
  
  // Estimated delivery time
  const estimatedTime = items.reduce((max, item) => {
    // Assuming each item has a prep time, use a default of 15 min
    return Math.max(max, 15);
  }, 0) + 10; // Add 10 min for delivery
  
  // Handle quantity change
  const handleQuantityChange = (index: number, delta: number) => {
    const item = items[index];
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        removeItem(index);
      } else {
        updateQuantity(index, newQuantity);
      }
    }
  };
  
  // Handle form submission
  const onSubmit = (data: CheckoutFormData) => {
    setShowConfirmDialog(true);
  };
  
  // Confirm order
  const confirmOrder = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate order reference
    const reference = `ORD${Date.now().toString().slice(-8)}`;
    setOrderReference(reference);
    setOrderComplete(true);
    setIsProcessing(false);
    clearCart();
  };
  
  // Order success view
  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been confirmed and is being prepared
            </p>
            
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">Order Reference</p>
              <p className="text-2xl font-bold font-mono">{orderReference}</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <Clock className="h-5 w-5" />
              <span>Estimated delivery: {estimatedTime} minutes</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to={`/menu/orders/${orderReference}`}>
                  Track Order
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/menu">Order More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu
            </p>
            <Button asChild>
              <Link to="/menu" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Browse Menu</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/menu">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Your Cart</h1>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items List */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {items.map((item, index) => (
                    <div key={item.menuItemId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <img
                        src={(item.menuItem.images?.[0] as any)?.url || (item.menuItem.images?.[0] as unknown as string) || '/placeholder-food.jpg'}
                        alt={item.menuItem.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.menuItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          NPR {item.menuItem.price.toLocaleString()} each
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(index, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-destructive"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-bold">
                        NPR {item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                  <CardDescription>
                    Where should we deliver your order?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={deliveryType}
                    onValueChange={(value: any) => setValue('deliveryType', value)}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="room"
                        id="room"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="room"
                        className={cn(
                          'flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 cursor-pointer transition-colors',
                          'peer-checked:border-primary peer-checked:bg-primary/5'
                        )}
                      >
                        <MapPin className="h-5 w-5 mb-2" />
                        <span className="font-medium">Room</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="table"
                        id="table"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="table"
                        className={cn(
                          'flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 cursor-pointer transition-colors',
                          'peer-checked:border-primary peer-checked:bg-primary/5'
                        )}
                      >
                        <span className="text-2xl mb-1">🍽️</span>
                        <span className="font-medium">Table</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="takeaway"
                        id="takeaway"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="takeaway"
                        className={cn(
                          'flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 cursor-pointer transition-colors',
                          'peer-checked:border-primary peer-checked:bg-primary/5'
                        )}
                      >
                        <span className="text-2xl mb-1">🥡</span>
                        <span className="font-medium">Takeaway</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {deliveryType === 'room' && (
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input
                        id="roomNumber"
                        placeholder="e.g., 101"
                        {...register('roomNumber')}
                      />
                    </div>
                  )}
                  
                  {deliveryType === 'table' && (
                    <div className="space-y-2">
                      <Label htmlFor="tableNumber">Table Number</Label>
                      <Input
                        id="tableNumber"
                        placeholder="e.g., T5"
                        {...register('tableNumber')}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any special requests for your order..."
                      rows={3}
                      {...register('specialInstructions')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: any) => setValue('paymentMethod', value)}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={cn(
                          'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-muted-foreground'
                        )}
                        onClick={() => setValue('paymentMethod', method.id as any)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.menuItemId} className="flex justify-between text-sm">
                        <span>
                          {item.menuItem.name} × {item.quantity}
                        </span>
                        <span>NPR {item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>NPR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Service charge (10%)</span>
                      <span>NPR {serviceCharge.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>NPR {total.toLocaleString()}</span>
                  </div>
                  
                  {/* Estimated Time */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: {estimatedTime} min</span>
                  </div>
                  
                  {/* Place Order Button */}
                  <Button type="submit" className="w-full" size="lg">
                    Place Order
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By placing this order, you agree to our Terms of Service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to place an order for {items.length} items.
              Total: NPR {total.toLocaleString()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOrder}>
              Confirm Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="font-medium">Processing your order...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </Card>
        </div>
      )}
    </div>
  );
}
