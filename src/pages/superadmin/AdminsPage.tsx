/**
 * Hotel PMS - Super Admin Admins Page
 * Admin user management for super admin with centralized data
 */

import * as React from 'react';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  KeyRound,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Clock,
  Building2,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/common';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

// Import centralized mock data
import {
  mockAdmins,
  availableHotels,
  adminRoleConfig,
  adminStatusConfig,
  type Admin,
  type AdminRole,
  type AdminStatus,
} from '@/data/mockData';
import { adminDataService } from '@/services/dataService';

/**
 * SuperAdminAdminsPage component
 */
export default function SuperAdminAdminsPage() {
  const { toast } = useToast();

  // State
  const [admins, setAdmins] = React.useState<Admin[]>(mockAdmins);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState<Admin | null>(null);
  const [selectedHotels, setSelectedHotels] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load admins
  const loadAdmins = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminDataService.getAdmins();
      setAdmins(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load admins.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Action Handlers
  const handleEditAdmin = (admin: Admin) => {
    toast({ title: 'Editing Admin', description: `Opening editor for ${admin.name}...` });
  };

  const handleResetPassword = async (admin: Admin) => {
    try {
      await adminDataService.resetPassword(admin.id);
      toast({ title: 'Password Reset', description: `Password reset email sent to ${admin.name}.` });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send password reset.' });
    }
  };

  const handleSuspendAdmin = async (admin: Admin) => {
    try {
      await adminDataService.suspendAdmin(admin.id);
      toast({ variant: 'destructive', title: 'Admin Suspended', description: `${admin.name}'s account has been suspended.` });
      loadAdmins();
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to suspend admin.' });
    }
  };

  const handleActivateAdmin = async (admin: Admin) => {
    try {
      await adminDataService.activateAdmin(admin.id);
      toast({ title: 'Admin Activated', description: `${admin.name}'s account has been activated.` });
      loadAdmins();
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to activate admin.' });
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    try {
      await adminDataService.deleteAdmin(admin.id);
      toast({ variant: 'destructive', title: 'Admin Deleted', description: `${admin.name}'s account has been removed.` });
      loadAdmins();
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete admin.' });
    }
  };

  const handleAddAdmin = async () => {
    toast({ title: 'Admin Added', description: 'New administrator has been created. Login credentials sent via email.' });
    setIsAddDialogOpen(false);
    setSelectedHotels([]);
    loadAdmins();
  };

  // Filter admins
  const filteredAdmins = React.useMemo(() => {
    return admins.filter((admin) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !admin.name.toLowerCase().includes(search) &&
          !admin.email.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (roleFilter !== 'all' && admin.role !== roleFilter) {
        return false;
      }

      if (statusFilter !== 'all' && admin.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [admins, debouncedSearch, roleFilter, statusFilter]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format last login
  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return formatDate(dateString);
  };

  // Stats
  const stats = React.useMemo(() => ({
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    superadmins: admins.filter(a => a.role === 'superadmin').length,
    hotelAdmins: admins.filter(a => a.role === 'hotel_admin').length,
  }), [admins]);

  // Toggle hotel selection
  const toggleHotelSelection = (hotel: string) => {
    setSelectedHotels(prev =>
      prev.includes(hotel)
        ? prev.filter(h => h !== hotel)
        : [...prev, hotel]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrators"
        description="Manage admin users across all properties"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAdmins} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.superadmins}</p>
                <p className="text-sm text-muted-foreground">Super Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.hotelAdmins}</p>
                <p className="text-sm text-muted-foreground">Hotel Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="hotel_admin">Hotel Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No admins found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first admin to get started'}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hotels</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={admin.avatar} alt={admin.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={adminRoleConfig[admin.role].color}>
                        {adminRoleConfig[admin.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        admin.status === 'active' ? 'success' :
                        admin.status === 'suspended' ? 'destructive' :
                        admin.status === 'pending' ? 'warning' : 'secondary'
                      }>
                        {adminStatusConfig[admin.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.hotels.length === 0 ? (
                        <span className="text-muted-foreground text-sm">All Properties</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {admin.hotels.slice(0, 2).map((hotel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {hotel.split(' ')[0]}
                            </Badge>
                          ))}
                          {admin.hotels.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{admin.hotels.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatLastLogin(admin.lastLogin)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(admin.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(admin)}>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {admin.status === 'active' || admin.status === 'pending' ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleSuspendAdmin(admin)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivateAdmin(admin)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteAdmin(admin)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
            <DialogDescription>
              Create a new admin account. Login credentials will be sent via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+977-98XXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="hotel_admin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="hotel_admin">Hotel Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign Hotels</Label>
              <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto space-y-2">
                {availableHotels.map((hotel) => (
                  <div key={hotel} className="flex items-center space-x-2">
                    <Checkbox
                      id={hotel}
                      checked={selectedHotels.includes(hotel)}
                      onCheckedChange={() => toggleHotelSelection(hotel)}
                    />
                    <label
                      htmlFor={hotel}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {hotel}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to grant access to all properties (Super Admin only)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
