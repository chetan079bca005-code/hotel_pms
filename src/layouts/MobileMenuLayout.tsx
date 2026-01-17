/**
 * Hotel PMS - Mobile Menu Layout Component
 * Layout for restaurant QR menu on mobile devices
 */

import { Outlet, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingCart,
  Receipt,
  User,
  ChevronLeft,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

/**
 * Bottom navigation items for mobile menu
 */
const bottomNavItems = [
  { href: '', label: 'Menu', icon: UtensilsCrossed },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/orders', label: 'Orders', icon: Receipt },
  { href: '/profile', label: 'Profile', icon: User },
];

/**
 * MobileMenuLayout component
 */
export default function MobileMenuLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotelId, tableId } = useParams();

  // Cart state
  const { getItemCount } = useCartStore();
  const totalItems = getItemCount();

  // Build base path for navigation
  const basePath = `/menu/${hotelId}${tableId ? `/table/${tableId}` : ''}`;

  // Check if link is active
  const isActive = (href: string) => {
    const fullPath = basePath + href;
    if (href === '') {
      return location.pathname === basePath || location.pathname === basePath + '/';
    }
    return location.pathname.startsWith(fullPath);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Back button and title */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Restaurant Menu</h1>
              {tableId && (
                <p className="text-xs text-muted-foreground">
                  Table {tableId}
                </p>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>नेपाली</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart button (mobile quick access) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate(`${basePath}/cart`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-[10px]"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="flex h-16 items-center justify-around">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            const fullHref = basePath + item.href;

            return (
              <Link
                key={item.label}
                to={fullHref}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {/* Cart badge */}
                  {item.label === 'Cart' && totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[9px]"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating cart button when items in cart */}
      {totalItems > 0 && !location.pathname.includes('/cart') && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <Button
            className="w-full shadow-lg gap-2"
            size="lg"
            onClick={() => navigate(`${basePath}/cart`)}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>View Cart</span>
            <Badge variant="secondary" className="ml-auto">
              {totalItems} item{totalItems > 1 ? 's' : ''}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
