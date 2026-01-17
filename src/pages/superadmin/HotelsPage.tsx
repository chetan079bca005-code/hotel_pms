/**
 * Hotel PMS - Super Admin Hotels Page
 * Hotel management for super admin with centralized data
 */

import * as React from 'react';
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Settings,
  Trash2,
  Edit,
  LayoutGrid,
  List,
  ExternalLink,
  Star,
  Users,
  BedDouble,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Phone,
  Mail,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/common';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

// Import centralized mock data
import {
  mockHotels,
  hotelStatusConfig,
  subscriptionTierConfig,
  type Hotel,
  type HotelStatus,
  type SubscriptionTier,
} from '@/data/mockData';
import { hotelDataService } from '@/services/dataService';

/**
 * SuperAdminHotelsPage component
 */
export default function SuperAdminHotelsPage() {
  const { toast } = useToast();

  // State
  const [hotels, setHotels] = React.useState<Hotel[]>(mockHotels);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = React.useState<string>('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load hotels
  const loadHotels = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await hotelDataService.getHotels();
      setHotels(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load hotels.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Action Handlers
  const handleEditHotel = (hotel: Hotel) => {
    toast({ title: 'Editing Hotel', description: `Opening editor for ${hotel.name}...` });
  };

  const handleSettingsHotel = (hotel: Hotel) => {
    toast({ title: 'Hotel Settings', description: `Opening settings for ${hotel.name}...` });
  };

  const handleDeleteHotel = async (hotel: Hotel) => {
    try {
      await hotelDataService.deleteHotel(hotel.id);
      toast({ variant: 'destructive', title: 'Hotel Deleted', description: `${hotel.name} has been removed.` });
      loadHotels();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete hotel.' });
    }
  };

  const handleAddHotel = async () => {
    toast({ title: 'Hotel Added', description: 'New property has been created successfully.' });
    setIsAddDialogOpen(false);
    loadHotels();
  };

  const handleOpenDashboard = (hotel: Hotel) => {
    toast({ title: 'Opening Dashboard', description: `Switching to ${hotel.name}'s admin panel...` });
    setSelectedHotel(null);
  };

  // Filter hotels
  const filteredHotels = React.useMemo(() => {
    return hotels.filter((hotel) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !hotel.name.toLowerCase().includes(search) &&
          !hotel.city.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (statusFilter !== 'all' && hotel.status !== statusFilter) {
        return false;
      }

      if (subscriptionFilter !== 'all' && hotel.subscription !== subscriptionFilter) {
        return false;
      }

      return true;
    });
  }, [hotels, debouncedSearch, statusFilter, subscriptionFilter]);

  // Stats
  const stats = React.useMemo(() => ({
    total: hotels.length,
    active: hotels.filter(h => h.status === 'active').length,
    totalRooms: hotels.reduce((sum, h) => sum + h.roomCount, 0),
    totalStaff: hotels.reduce((sum, h) => sum + h.staffCount, 0),
  }), [hotels]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotels Management"
        description="Manage all hotel properties in your portfolio"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadHotels} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
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
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Hotels</p>
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
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BedDouble className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRooms}</p>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStaff}</p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
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
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels List/Grid */}
      {isLoading ? (
        <div className={cn(
          viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'
        )}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || subscriptionFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first hotel to get started'}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={hotel.logo} alt={hotel.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {hotel.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold line-clamp-1">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {hotel.city}, {hotel.country}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedHotel(hotel)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditHotel(hotel)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSettingsHotel(hotel)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteHotel(hotel)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={hotel.status === 'active' ? 'success' : hotel.status === 'maintenance' ? 'warning' : hotel.status === 'pending' ? 'outline' : 'secondary'}>
                      {hotelStatusConfig[hotel.status].label}
                    </Badge>
                    <Badge className={subscriptionTierConfig[hotel.subscription].color}>
                      {subscriptionTierConfig[hotel.subscription].label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rooms</p>
                      <p className="font-medium">{hotel.roomCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Staff</p>
                      <p className="font-medium">{hotel.staffCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{hotel.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reviews</p>
                      <p className="font-medium">{hotel.reviewCount}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => handleOpenDashboard(hotel)}
                >
                  Open Dashboard
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={hotel.logo} alt={hotel.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {hotel.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{hotel.name}</h3>
                        <Badge variant={hotel.status === 'active' ? 'success' : hotel.status === 'maintenance' ? 'warning' : 'secondary'}>
                          {hotelStatusConfig[hotel.status].label}
                        </Badge>
                        <Badge className={subscriptionTierConfig[hotel.subscription].color}>
                          {subscriptionTierConfig[hotel.subscription].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{hotel.city}, {hotel.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{hotel.roomCount}</p>
                      <p className="text-muted-foreground">Rooms</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{hotel.staffCount}</p>
                      <p className="text-muted-foreground">Staff</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <p className="font-medium">{hotel.rating || 'N/A'}</p>
                      </div>
                      <p className="text-muted-foreground">Rating</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedHotel(hotel)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditHotel(hotel)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSettingsHotel(hotel)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteHotel(hotel)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Hotel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogDescription>
              Enter the details of the new hotel property
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input id="name" placeholder="Enter hotel name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="hotel-slug" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the hotel..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Country" defaultValue="Nepal" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hotel@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+977-1-1234567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscription">Subscription Plan</Label>
              <Select defaultValue="basic">
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic - NPR 29,000/year</SelectItem>
                  <SelectItem value="professional">Professional - NPR 59,000/year</SelectItem>
                  <SelectItem value="enterprise">Enterprise - NPR 99,000/year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHotel}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hotel Details Sheet */}
      <Sheet open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedHotel?.logo} alt={selectedHotel?.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedHotel?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              {selectedHotel?.name}
            </SheetTitle>
            <SheetDescription>
              {selectedHotel?.description}
            </SheetDescription>
          </SheetHeader>

          {selectedHotel && (
            <div className="mt-6 space-y-6">
              <div className="flex gap-2">
                <Badge variant={selectedHotel.status === 'active' ? 'success' : selectedHotel.status === 'maintenance' ? 'warning' : 'secondary'}>
                  {hotelStatusConfig[selectedHotel.status].label}
                </Badge>
                <Badge className={subscriptionTierConfig[selectedHotel.subscription].color}>
                  {subscriptionTierConfig[selectedHotel.subscription].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rooms</p>
                  <p className="text-2xl font-bold">{selectedHotel.roomCount}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Staff</p>
                  <p className="text-2xl font-bold">{selectedHotel.staffCount}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <p className="text-2xl font-bold">{selectedHotel.rating || 'N/A'}</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Reviews</p>
                  <p className="text-2xl font-bold">{selectedHotel.reviewCount}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedHotel.address}, {selectedHotel.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedHotel.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedHotel.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleOpenDashboard(selectedHotel)}>
                  Open Dashboard
                </Button>
                <Button variant="outline" onClick={() => handleEditHotel(selectedHotel)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => handleSettingsHotel(selectedHotel)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
