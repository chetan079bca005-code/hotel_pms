/**
 * Hotel PMS - Admin Rooms Management Page
 * Manage hotel rooms and room types
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BedDouble,
  Users,
  Grid,
  List,
  Filter,
  Settings,
  CheckCircle,
  XCircle,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Switch } from '@/components/ui/switch';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  mockRooms,
  mockRoomTypes,
  Room,
  RoomType,
  RoomStatus
} from '@/data/mockData';


/**
 * Status badge config
 */
const statusConfig: Record<RoomStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'; icon: React.ElementType }> = {
  available: { label: 'Available', variant: 'success', icon: CheckCircle },
  occupied: { label: 'Occupied', variant: 'default', icon: Users },
  maintenance: { label: 'Maintenance', variant: 'destructive', icon: Wrench },
  cleaning: { label: 'Cleaning', variant: 'warning', icon: BedDouble },
};

const roomTypesData = mockRoomTypes;

const roomsData = mockRooms;

/**
 * AdminRoomsPage component
 */
export default function AdminRoomsPage() {
  const { toast } = useToast();

  // State
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [isAddRoomOpen, setIsAddRoomOpen] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Action Handlers (Demo Mode)
  const handleCreateRoom = () => {
    toast({ title: 'Room Created', description: 'New room has been added successfully.' });
    setIsAddRoomOpen(false);
  };

  const handleViewRoom = (roomNumber: string) => {
    toast({ title: `Room ${roomNumber}`, description: 'Opening room details...' });
  };

  const handleEditRoom = (roomNumber: string) => {
    toast({ title: `Editing Room ${roomNumber}`, description: 'Opening edit form...' });
  };

  const handleMarkAvailable = (roomNumber: string) => {
    toast({ title: 'Status Updated', description: `Room ${roomNumber} marked as Available.` });
  };

  const handleSetMaintenance = (roomNumber: string) => {
    toast({ variant: 'destructive', title: 'Status Updated', description: `Room ${roomNumber} set to Maintenance.` });
  };

  const handleDeleteRoom = (roomNumber: string) => {
    toast({ variant: 'destructive', title: 'Room Deleted', description: `Room ${roomNumber} has been removed.` });
  };

  // Filter rooms
  const filteredRooms = React.useMemo(() => {
    return roomsData.filter((room) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !room.number.includes(search) &&
          !room.name.toLowerCase().includes(search) &&
          !room.type.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (statusFilter !== 'all' && room.status !== statusFilter) {
        return false;
      }

      if (typeFilter !== 'all' && room.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [debouncedSearch, statusFilter, typeFilter]);

  // Stats
  const stats = {
    total: roomsData.length,
    available: roomsData.filter((r) => r.status === 'available').length,
    occupied: roomsData.filter((r) => r.status === 'occupied').length,
    maintenance: roomsData.filter((r) => r.status === 'maintenance').length,
    cleaning: roomsData.filter((r) => r.status === 'cleaning').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooms Management"
        description="Manage hotel rooms and room types"
        actions={
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/rooms/types" className="inline-flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <span>Room Types</span>
              </Link>
            </Button>
            <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Create a new room in the hotel
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input id="roomNumber" placeholder="e.g., 101" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((floor) => (
                            <SelectItem key={floor} value={floor.toString()}>
                              Floor {floor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypesData.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Night (NPR)</Label>
                    <Input id="price" type="number" placeholder="8000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Room description..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="active" defaultChecked />
                    <Label htmlFor="active">Active (available for booking)</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRoom}>
                    Create Room
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BedDouble className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('available')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('occupied')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.occupied}</p>
                <p className="text-xs text-muted-foreground">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('cleaning')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <BedDouble className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cleaning}</p>
                <p className="text-xs text-muted-foreground">Cleaning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('maintenance')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
                <p className="text-xs text-muted-foreground">Maintenance</p>
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
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {roomTypesData.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const StatusIcon = statusConfig[room.status].icon;
            return (
              <Card key={room.id} className={cn(!room.isActive && 'opacity-60')}>
                <div className="relative h-32">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <Badge
                    variant={statusConfig[room.status].variant}
                    className="absolute top-2 right-2"
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[room.status].label}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">Room {room.number}</h3>
                      <p className="text-sm text-muted-foreground">{room.type}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewRoom(room.number)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditRoom(room.number)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleMarkAvailable(room.number)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Available
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetMaintenance(room.number)}>
                          <Wrench className="h-4 w-4 mr-2" />
                          Set Maintenance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRoom(room.number)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {room.capacity}
                    </span>
                    <span>Floor {room.floor}</span>
                  </div>

                  {room.currentGuest && (
                    <div className="p-2 bg-muted rounded-lg text-sm mb-3">
                      <p className="font-medium">{room.currentGuest}</p>
                      <p className="text-xs text-muted-foreground">
                        Checkout: {new Date(room.checkOut!).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      NPR {room.price.toLocaleString()}/night
                    </span>
                    {!room.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => {
                  const StatusIcon = statusConfig[room.status].icon;
                  return (
                    <TableRow key={room.id} className={cn(!room.isActive && 'opacity-60')}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-12 h-10 object-cover rounded"
                          />
                          <span className="font-medium">{room.number}</span>
                        </div>
                      </TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>Floor {room.floor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {room.capacity}
                        </div>
                      </TableCell>
                      <TableCell>NPR {room.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[room.status].variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[room.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {room.currentGuest || '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewRoom(room.number)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditRoom(room.number)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRoom(room.number)}>
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
      )}

      {filteredRooms.length === 0 && (
        <EmptyState
          variant="rooms"
          title="No rooms found"
          description="Try adjusting your search or filters"
        />
      )}
    </div>
  );
}
