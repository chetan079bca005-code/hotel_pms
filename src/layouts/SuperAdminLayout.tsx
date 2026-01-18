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
  Shield,
  Activity,
  FileText,
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSelector } from '@/components/common/LanguageSelector';
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
function SuperAdminSidebar({
  className,
  collapsed,
  toggleCollapse
}: {
  className?: string;
  collapsed?: boolean;
  toggleCollapse?: () => void;
}) {
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
        'flex flex-col border-r border-[#ffffff20] bg-hotel-primary text-white transition-all duration-300 h-full',
        className
      )}
    >
      {/* Logo & Toggle */}
      <div className={cn("flex h-16 items-center border-b border-[#ffffff20] transition-all duration-300", collapsed ? "justify-center px-0" : "justify-between px-4")}>
        {!collapsed && (
          <Link to="/superadmin" className="flex items-center gap-2 overflow-hidden">
            {/* Logo Icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-hotel-accent">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-hotel-accent whitespace-nowrap">Super Admin</span>
          </Link>
        )}

        {/* Toggle Button (Desktop) */}
        <div className="hidden lg:flex">
          {collapsed ? (
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="text-gray-300 hover:text-white hover:bg-white/10 h-10 w-10">
              <Shield className="h-6 w-6 text-hotel-accent" />
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
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-hotel-accent bg-white/5'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.href) ? "text-hotel-accent" : "text-gray-300")} />
              {!collapsed && item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* System status */}
      <div className="border-t border-[#ffffff20] p-4 shrink-0">
        {!collapsed ? (
          <>
            <div className="rounded-lg bg-black/20 p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-white">System Status</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
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

            <Link to="/superadmin/docs" className="flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-hotel-accent/20 transition-colors">
                <FileText className="h-4 w-4 text-hotel-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Documentation</p>
                <p className="text-xs text-gray-400">User Guide & API</p>
              </div>
            </Link>
          </>
        ) : (
          <div className="flex justify-center">
            <Link to="/superadmin/docs" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-hotel-accent transition-colors" title="Documentation">
              <FileText className="h-4 w-4" />
            </Link>
          </div>
        )}
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
  const [collapsed, setCollapsed] = React.useState(false);

  // Auth state
  const { user, logout } = useAuthStore();

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <SuperAdminSidebar
        className={cn(
          "hidden lg:flex shrink-0 h-full",
          collapsed ? "w-[70px]" : "w-64"
        )}
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r-0 bg-hotel-primary text-white">
          <SuperAdminSidebar className="flex h-full" />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="relative flex h-20 lg:h-24 shrink-0 items-center justify-between z-10 p-4 lg:p-6 transition-all overflow-hidden mx-2 mt-2 rounded-2xl bg-[#5c77a3] shadow-lg group">
          {/* Banner Background */}
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
                alt="System Background"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Very subtle overlays to maintain some contrast without darkening to grey */}
            <div className="absolute inset-0 bg-white/5" />
            <div className="absolute inset-0 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 flex w-full justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Title */}
              <div>
                <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-wider mb-0.5">
                  <span>PMS</span>
                  <span className="text-white/30">/</span>
                  <span className="text-hotel-accent font-medium">Super Admin</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
                  System Overview
                </h1>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  type="search"
                  placeholder="System search..."
                  className="pl-10 h-10 w-72 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-hotel-accent/40 focus-visible:bg-white/15 backdrop-blur-md"
                />
              </div>

              <div className="flex items-center gap-2 bg-black/30 p-1 rounded-full backdrop-blur-md border border-white/10">
                {/* Language toggle */}
                <LanguageSelector className="rounded-full text-white/70 hover:text-white hover:bg-white/10 h-8 w-8" />

                {/* Theme toggle */}
                <ThemeToggle className="rounded-full text-white/70 hover:text-white hover:bg-white/10 h-8 w-8" />

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full text-white/70 hover:text-white hover:bg-white/10 h-8 w-8">
                      <Bell className="h-4 w-4" />
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive ring-1 ring-black/40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 backdrop-blur-xl bg-background/95">
                    <DropdownMenuLabel>System Alerts</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-64 overflow-auto">
                      <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer p-3">
                        <span className="font-medium">New hotel registration</span>
                        <span className="text-xs text-muted-foreground">
                          Mountain View Resort pending approval
                        </span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-4 w-px bg-white/20 hidden sm:block mx-1" />

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-white/30 hover:ring-2 hover:ring-hotel-accent/50 transition-all">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                        <AvatarFallback className="bg-hotel-accent text-hotel-primary font-bold">
                          {user?.fullName ? getInitials(user.fullName) : 'SA'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.fullName || 'Super Admin'}</span>
                        <span className="text-[10px] font-normal text-muted-foreground capitalize">System Admin</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/superadmin/profile')} className="cursor-pointer">
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/superadmin/security')} className="cursor-pointer">
                      Security Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
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
