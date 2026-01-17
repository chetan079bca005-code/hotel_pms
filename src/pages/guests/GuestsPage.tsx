/**
 * Hotel PMS - Admin Guests Management Page
 * Manage guest profiles and information
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Download,
  Filter,
  Users,
  Crown,
  BedDouble,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/**
 * Guest membership type
 */
type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

/**
 * Guest interface
 */
interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  membershipTier: MembershipTier;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: string;
  notes?: string;
  isVIP: boolean;
  createdAt: string;
  avatar?: string;
}

/**
 * Membership tier config
 */
const membershipConfig: Record<MembershipTier, { label: string; color: string; icon: React.ElementType }> = {
  bronze: { label: 'Bronze', color: 'text-amber-700 bg-amber-100', icon: Users },
  silver: { label: 'Silver', color: 'text-gray-600 bg-gray-100', icon: Users },
  gold: { label: 'Gold', color: 'text-yellow-700 bg-yellow-100', icon: Star },
  platinum: { label: 'Platinum', color: 'text-purple-700 bg-purple-100', icon: Crown },
};

/**
 * Mock guests data
 */
const guestsData: Guest[] = [
  {
    id: '1',
    firstName: 'Ramesh',
    lastName: 'Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '+977 9841234567',
    address: 'Lazimpat, Kathmandu',
    city: 'Kathmandu',
    country: 'Nepal',
    nationality: 'Nepali',
    idType: 'Citizenship',
    idNumber: 'NP12345678',
    membershipTier: 'gold',
    totalBookings: 15,
    totalSpent: 450000,
    lastVisit: '2024-01-20',
    isVIP: true,
    createdAt: '2022-05-15',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 555-0123',
    city: 'New York',
    country: 'United States',
    nationality: 'American',
    idType: 'Passport',
    idNumber: 'US987654321',
    membershipTier: 'silver',
    totalBookings: 3,
    totalSpent: 125000,
    lastVisit: '2024-01-18',
    isVIP: false,
    createdAt: '2023-08-20',
  },
  {
    id: '3',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9876543210',
    city: 'Mumbai',
    country: 'India',
    nationality: 'Indian',
    idType: 'Passport',
    idNumber: 'IN456789123',
    membershipTier: 'bronze',
    totalBookings: 2,
    totalSpent: 35000,
    lastVisit: '2024-01-20',
    isVIP: false,
    createdAt: '2023-11-10',
  },
  {
    id: '4',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+44 7700 900123',
    city: 'London',
    country: 'United Kingdom',
    nationality: 'British',
    idType: 'Passport',
    idNumber: 'GB111222333',
    membershipTier: 'platinum',
    totalBookings: 28,
    totalSpent: 1250000,
    lastVisit: '2024-01-15',
    isVIP: true,
    createdAt: '2021-03-22',
    notes: 'Prefers quiet rooms, allergic to nuts',
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Brown',
    email: 'emma.brown@example.com',
    phone: '+61 412 345 678',
    city: 'Sydney',
    country: 'Australia',
    nationality: 'Australian',
    idType: 'Passport',
    idNumber: 'AU444555666',
    membershipTier: 'gold',
    totalBookings: 8,
    totalSpent: 320000,
    lastVisit: '2023-12-28',
    isVIP: true,
    createdAt: '2022-09-05',
  },
];

/**
 * AdminGuestsPage component
 */
export default function AdminGuestsPage() {
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [membershipFilter, setMembershipFilter] = React.useState<string>('all');
  const [countryFilter, setCountryFilter] = React.useState<string>('all');
  const [selectedGuest, setSelectedGuest] = React.useState<Guest | null>(null);
  const [isAddGuestOpen, setIsAddGuestOpen] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Action Handlers (Demo Mode)
  const handleExport = () => {
    toast({ title: 'Exporting Guests', description: 'Guests_Data.csv is being generated...' });
  };

  const handleCreateGuest = () => {
    toast({ title: 'Guest Created', description: 'New guest profile has been added.' });
    setIsAddGuestOpen(false);
  };

  const handleEditGuest = (name: string) => {
    toast({ title: `Editing ${name}`, description: 'Opening guest profile editor...' });
  };

  const handleViewBookings = (name: string) => {
    toast({ title: `${name}'s Bookings`, description: 'Navigating to booking history...' });
  };

  const handleSendEmail = (email: string) => {
    toast({ title: 'Email Composer', description: `Composing email to ${email}...` });
  };

  const handleDeleteGuest = (name: string) => {
    toast({ variant: 'destructive', title: 'Guest Deleted', description: `${name}'s profile has been removed.` });
  };

  const handleNewBookingForGuest = () => {
    toast({ title: 'New Booking', description: 'Opening booking form for selected guest...' });
    setSelectedGuest(null);
  };

  // Get unique countries
  const countries = React.useMemo(() => {
    return [...new Set(guestsData.map((g) => g.country))];
  }, []);

  // Filter guests
  const filteredGuests = React.useMemo(() => {
    return guestsData.filter((guest) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
        if (
          !fullName.includes(search) &&
          !guest.email.toLowerCase().includes(search) &&
          !guest.phone.includes(search)
        ) {
          return false;
        }
      }

      if (membershipFilter !== 'all' && guest.membershipTier !== membershipFilter) {
        return false;
      }

      if (countryFilter !== 'all' && guest.country !== countryFilter) {
        return false;
      }

      return true;
    });
  }, [debouncedSearch, membershipFilter, countryFilter]);

  // Stats
  const stats = {
    total: guestsData.length,
    vip: guestsData.filter((g) => g.isVIP).length,
    platinum: guestsData.filter((g) => g.membershipTier === 'platinum').length,
    newThisMonth: guestsData.filter((g) => {
      const created = new Date(g.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guests Management"
        description="View and manage guest profiles"
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Guest</DialogTitle>
                  <DialogDescription>
                    Create a new guest profile
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Smith" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+977 9841234567" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nepal">Nepal</SelectItem>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input id="nationality" placeholder="Nepali" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="citizenship">Citizenship</SelectItem>
                          <SelectItem value="license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input id="idNumber" placeholder="NP12345678" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Full address..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Special requests, preferences, allergies..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddGuestOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGuest}>
                    Create Guest
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Guests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.vip}</p>
                <p className="text-xs text-muted-foreground">VIP Guests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.platinum}</p>
                <p className="text-xs text-muted-foreground">Platinum Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.newThisMonth}</p>
                <p className="text-xs text-muted-foreground">New This Month</p>
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
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Guests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => {
                const MemberIcon = membershipConfig[guest.membershipTier].icon;
                return (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>
                              {guest.firstName[0]}{guest.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {guest.isVIP && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Star className="h-2.5 w-2.5 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {guest.firstName} {guest.lastName}
                          </p>
                          {guest.isVIP && (
                            <Badge variant="warning" className="text-xs">VIP</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {guest.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {guest.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {guest.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={membershipConfig[guest.membershipTier].color}>
                        <MemberIcon className="h-3 w-3 mr-1" />
                        {membershipConfig[guest.membershipTier].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                        {guest.totalBookings}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        NPR {guest.totalSpent.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(guest.lastVisit)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedGuest(guest)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditGuest(`${guest.firstName} ${guest.lastName}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewBookings(`${guest.firstName} ${guest.lastName}`)}>
                            <BedDouble className="h-4 w-4 mr-2" />
                            View Bookings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(guest.email)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteGuest(`${guest.firstName} ${guest.lastName}`)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Guest Profile Dialog */}
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedGuest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl">
                        {selectedGuest.firstName[0]}{selectedGuest.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {selectedGuest.isVIP && (
                      <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="h-3.5 w-3.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedGuest.firstName} {selectedGuest.lastName}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={membershipConfig[selectedGuest.membershipTier].color}>
                        {membershipConfig[selectedGuest.membershipTier].label} Member
                      </Badge>
                      {selectedGuest.isVIP && (
                        <Badge variant="warning">VIP</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                  <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
                  <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedGuest.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedGuest.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="font-medium">{selectedGuest.country}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Nationality</p>
                      <p className="font-medium">{selectedGuest.nationality || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ID Type</p>
                      <p className="font-medium">{selectedGuest.idType || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ID Number</p>
                      <p className="font-medium">{selectedGuest.idNumber || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedGuest.address && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedGuest.address}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold">{selectedGuest.totalBookings}</p>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold">
                          NPR {(selectedGuest.totalSpent / 1000).toFixed(0)}K
                        </p>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="font-medium">{formatDate(selectedGuest.lastVisit)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{formatDate(selectedGuest.createdAt)}</p>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    {selectedGuest.notes ? (
                      <p>{selectedGuest.notes}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No notes available</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={handleNewBookingForGuest}>
                  <BedDouble className="h-4 w-4 mr-2" />
                  <span>New Booking</span>
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { if (selectedGuest) handleSendEmail(selectedGuest.email); setSelectedGuest(null); }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
