/**
 * Hotel PMS - Super Admin Layout Component
 * Layout for super admin (multi-property management)
 */

import * as React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon,
  Shield,
  Activity,
  FileText,
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
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

/**
 * Sidebar navigation items for super admin
 */
const sidebarItems = [
  {
    title: 'Overview',
    href: '/superadmin',
    icon: LayoutDashboard,
  },
  {
    title: 'Hotels',
    href: '/superadmin/hotels',
    icon: Building2,
  },
  {
    title: 'Hotel Admins',
    href: '/superadmin/admins',
    icon: Users,
  },
  {
    title: 'Subscriptions',
    href: '/superadmin/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Analytics',
    href: '/superadmin/analytics',
    icon: BarChart3,
  },
  {
    title: 'System Health',
    href: '/superadmin/system',
    icon: Activity,
  },
  {
    title: 'Audit Logs',
    href: '/superadmin/logs',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/superadmin/settings',
    icon: Settings,
  },
];

/**
 * Sidebar component for super admin
 */
function SuperAdminSidebar({ className }: { className?: string }) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/superadmin') {
      return location.pathname === '/superadmin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-[#ffffff20] bg-hotel-primary text-white transition-all duration-300',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#ffffff20] px-6">
        <Link to="/superadmin" className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-hotel-accent">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-hotel-accent">Super Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-hotel-accent bg-white/5'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.href) ? "text-hotel-accent" : "text-gray-300")} />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* System status */}
      <div className="border-t border-[#ffffff20] p-4">
        <div className="rounded-lg bg-black/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-white">System Status</span>
          </div>
          <p className="text-xs text-gray-400">
            All services operational
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Hotels:</span>
              <span className="ml-1 font-medium text-white">24</span>
            </div>
            <div>
              <span className="text-gray-400">Active:</span>
              <span className="ml-1 font-medium text-green-400">22</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * SuperAdminLayout component
 */
export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Auth state
  const { user, logout } = useAuthStore();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <SuperAdminSidebar className="hidden lg:flex w-64 shrink-0" />

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r-0 bg-hotel-primary text-white">
          <SuperAdminSidebar className="flex h-full" />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 transition-all">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Title */}
            <h1 className="text-lg font-semibold text-foreground/80 hidden sm:block">
              Super Admin Dashboard
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
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>System Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer p-3">
                    <span className="font-medium">New hotel registration</span>
                    <span className="text-xs text-muted-foreground">
                      Mountain View Resort pending approval
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer p-3">
                    <span className="font-medium">Subscription expiring</span>
                    <span className="text-xs text-muted-foreground">
                      3 hotels have subscriptions expiring this week
                    </span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center font-medium cursor-pointer">
                  View all alerts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full sm:h-auto sm:w-auto sm:rounded-lg sm:pl-2 sm:pr-3 gap-2 hover:bg-muted/50">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user?.fullName ? getInitials(user.fullName) : 'SA'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-sm font-medium leading-none">{user?.fullName || 'Super Admin'}</span>
                    <span className="text-[10px] text-muted-foreground capitalize mt-0.5">System Admin</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/superadmin/profile')} className="cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/superadmin/security')} className="cursor-pointer">
                  Security Settings
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
