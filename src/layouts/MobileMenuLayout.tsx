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
      {/* Header with Banner Background */}
      <header className="relative w-auto h-20 overflow-hidden group z-50 mx-2 mt-2 rounded-2xl bg-hotel-primary shadow-lg transition-all">
        {/* Banner Image */}
        <div className="absolute inset-0 z-0">
          {/* Blurred Background Layer (Matches corners to image colors) */}
          <img
            src="/banner.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
          />
          {/* Main Image Layer (Fully visible) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/banner.png"
              alt="Restaurant Background"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Very subtle overlays to maintain some contrast without darkening to grey */}
          <div className="absolute inset-0 bg-white/5" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-between px-4">
          {/* Back button and title */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0 text-white hover:bg-white/20 h-10 w-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="drop-shadow-md">
              <h1 className="text-xl font-bold text-white leading-tight">Restaurant Menu</h1>
              {tableId && (
                <p className="text-xs text-white/80 font-medium">
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
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="backdrop-blur-xl bg-background/95">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>नेपाली</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart button (mobile quick access) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/20 h-10 w-10"
              onClick={() => navigate(`${basePath}/cart`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 right-1 h-5 min-w-5 px-1.5 text-[10px] ring-2 ring-black/40"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
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
