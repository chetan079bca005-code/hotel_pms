/**
 * Hotel PMS - App Layout Component
 * Layout for hotel admin dashboard
 */

import * as React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  CreditCard,
  ClipboardList,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage, getInitials } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/auth.types';

/**
 * Sidebar navigation items
 */
interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
  roles?: UserRole[]; // Allowed roles
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['superadmin', 'admin', 'manager', 'receptionist', 'housekeeping', 'revenue', 'kitchen'],
  },
  {
    title: 'Rooms',
    href: '/admin/rooms',
    icon: BedDouble,
    roles: ['superadmin', 'admin', 'manager', 'receptionist', 'housekeeping', 'revenue'],
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: CalendarCheck,
    roles: ['superadmin', 'admin', 'manager', 'receptionist', 'revenue'],
  },
  {
    title: 'Guests',
    href: '/admin/guests',
    icon: Users,
    roles: ['superadmin', 'admin', 'manager', 'receptionist'],
  },
  {
    title: 'Menu',
    href: '/admin/menu',
    icon: UtensilsCrossed,
    roles: ['superadmin', 'admin', 'manager', 'kitchen'],
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: 5,
    roles: ['superadmin', 'admin', 'manager', 'kitchen', 'receptionist'],
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    roles: ['superadmin', 'admin', 'manager', 'revenue'],
  },
  {
    title: 'Housekeeping',
    href: '/admin/housekeeping',
    icon: ClipboardList,
    roles: ['superadmin', 'admin', 'manager', 'housekeeping', 'receptionist'],
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
    roles: ['superadmin', 'admin', 'manager'],
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    roles: ['superadmin', 'admin', 'manager', 'revenue'],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['superadmin', 'admin', 'manager'],
  },
];

/**
 * Sidebar component
 */
function Sidebar({ className, collapsed, toggleCollapse }: { className?: string; collapsed?: boolean; toggleCollapse?: () => void }) {
  const location = useLocation();
  // Use store for reading user role efficiently, or useAuth.
  // Since Sidebar is just display, useAuthStore is fine for reading.
  const { user } = useAuthStore();
  const userRole = user?.role || 'guest';

  // Filter items based on role
  const filteredItems = sidebarItems.filter((item) => {
    if (!item.roles) return true;
    if (userRole === 'guest' && item.href === '/admin') return true;
    return item.roles.includes(userRole);
  });

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-[#ffffff20] bg-hotel-primary text-white transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-64',
        className
      )}
    >
      {/* Logo & Toggle */}
      <div className={cn("flex h-16 items-center border-b border-[#ffffff20] transition-all duration-300", collapsed ? "justify-center px-0" : "justify-between px-4")}>
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
            {/* Logo Icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-hotel-accent">
              <BedDouble className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-hotel-accent whitespace-nowrap">Namaste PMS</span>
          </Link>
        )}

        {/* Toggle Button (Desktop) */}
        <div className="hidden lg:flex">
          {collapsed ? (
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="text-gray-300 hover:text-white hover:bg-white/10 h-10 w-10">
              <BedDouble className="h-6 w-6 text-hotel-accent" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="text-gray-300 hover:text-white hover:bg-white/10 h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-hotel-accent bg-white/5' // Gold for active
                  : 'text-gray-300 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.href) ? "text-hotel-accent" : "text-gray-300")} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="ml-auto h-5 min-w-5 px-1.5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="border-t border-[#ffffff20] p-4">
        {!collapsed && (
          <div className="rounded-lg bg-black/20 p-4">
            <p className="text-sm font-medium text-white">Need help?</p>
            <p className="text-xs text-gray-400 mt-1">
              Check documentation
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * AppLayout component
 */
export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Auth state - USE useAuth for actions!
  const { user, logout } = useAuth();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        className="hidden lg:flex shrink-0 h-full"
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r-0 bg-hotel-primary">
          <Sidebar className="flex h-full w-full" />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur z-10 px-6 transition-all">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page Title (Breadcrumb placeholder) */}
            <h1 className="text-lg font-semibold text-foreground/80 hidden sm:block">
              Dashboard
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 h-9 w-64 bg-muted/40 border-none focus-visible:ring-1"
              />
            </div>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground hover:text-foreground">
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 transform transition-all duration-200">
                <div className="p-4 border-b">
                  <h4 className="font-semibold leading-none">Notifications</h4>
                  <p className="text-xs text-muted-foreground mt-1">You have 3 unread messages</p>
                </div>
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <span className="font-medium text-sm">New booking received</span>
                    <span className="text-xs text-muted-foreground">
                      Room 101 booked for Dec 25-28
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <span className="font-medium text-sm">Payment confirmed</span>
                    <span className="text-xs text-muted-foreground">
                      NPR 15,000 received via eSewa
                    </span>
                  </DropdownMenuItem>
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="link" size="sm" className="w-full text-xs">View all</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full sm:h-auto sm:w-auto sm:rounded-lg sm:pl-2 sm:pr-3 gap-2 hover:bg-muted/50">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user?.fullName ? getInitials(user.fullName) : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-sm font-medium leading-none">{user?.fullName || 'Admin'}</span>
                    <span className="text-[10px] text-muted-foreground capitalize mt-0.5">{user?.role || 'User'}</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block delay-150" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/profile')} className="cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="cursor-pointer">
                  Hotel Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-muted/5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
