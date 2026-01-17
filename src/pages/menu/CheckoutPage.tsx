/**
 * Hotel PMS - Checkout Page
 * Order checkout page
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handlePlaceOrder = () => {
    // TODO: Implement order placement
    clearCart();
    navigate('/menu/orders');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.menuItem.name} × {item.quantity}</span>
                  <span>NPR {(item.totalPrice).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-4 font-bold flex justify-between">
                <span>Total</span>
                <span>NPR {getCartTotal().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Payment will be collected upon delivery.
            </p>
            <Button className="w-full" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
