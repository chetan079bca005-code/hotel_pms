/**
 * Hotel PMS - Admin Menu Management Page
 * Manage restaurant menu items and categories
 */

import * as React from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Leaf,
  Flame,
  Star,
  Grid,
  List,
  Settings,
  Power,
  Image,
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
import { Checkbox } from '@/components/ui/checkbox';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

/**
 * Category interface
 */
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
  isActive: boolean;
}

/**
 * Menu item interface
 */
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  image: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  prepTime: number;
  isAvailable: boolean;
  createdAt: string;
}

/**
 * Mock categories data
 */
const categoriesData: Category[] = [
  { id: '1', name: 'Breakfast', description: 'Morning meals', icon: '🍳', itemCount: 6, isActive: true },
  { id: '2', name: 'Nepali', description: 'Traditional favorites', icon: '🇳🇵', itemCount: 5, isActive: true },
  { id: '3', name: 'Indian', description: 'Authentic flavors', icon: '🍛', itemCount: 4, isActive: true },
  { id: '4', name: 'Chinese', description: 'Asian delights', icon: '🥡', itemCount: 4, isActive: true },
  { id: '5', name: 'Continental', description: 'Western cuisine', icon: '🍝', itemCount: 3, isActive: true },
  { id: '6', name: 'Beverages', description: 'Drinks & more', icon: '🥤', itemCount: 5, isActive: true },
  { id: '7', name: 'Desserts', description: 'Sweet treats', icon: '🍰', itemCount: 4, isActive: true },
];

/**
 * Mock menu items data
 */
const menuItemsData: MenuItem[] = [
  {
    id: '1',
    name: 'Dal Bhat Set',
    description: 'Traditional Nepali meal with dal, rice, vegetables, pickle, and papad',
    price: 350,
    categoryId: '2',
    categoryName: 'Nepali',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    prepTime: 20,
    isAvailable: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Momo (Chicken)',
    description: 'Steamed dumplings filled with spiced chicken',
    price: 280,
    categoryId: '2',
    categoryName: 'Nepali',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    isVegetarian: false,
    isSpicy: true,
    isPopular: true,
    prepTime: 25,
    isAvailable: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken',
    price: 450,
    categoryId: '3',
    categoryName: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    prepTime: 30,
    isAvailable: true,
    createdAt: '2024-01-02',
  },
  {
    id: '4',
    name: 'English Breakfast',
    description: 'Eggs, bacon, sausages, beans, toast, and grilled tomatoes',
    price: 550,
    categoryId: '1',
    categoryName: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    prepTime: 20,
    isAvailable: true,
    createdAt: '2024-01-03',
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with lemon butter sauce',
    price: 850,
    categoryId: '5',
    categoryName: 'Continental',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    prepTime: 35,
    isAvailable: false,
    createdAt: '2024-01-04',
  },
];

/**
 * AdminMenuPage component
 */
export default function AdminMenuPage() {
  // State
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [activeTab, setActiveTab] = React.useState('items');
  const [isAddItemOpen, setIsAddItemOpen] = React.useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = React.useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Filter menu items
  const filteredItems = React.useMemo(() => {
    return menuItemsData.filter((item) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !item.name.toLowerCase().includes(search) &&
          !item.description.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      
      if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) {
        return false;
      }
      
      return true;
    });
  }, [debouncedSearch, categoryFilter]);
  
  // Stats
  const stats = {
    totalItems: menuItemsData.length,
    activeItems: menuItemsData.filter((i) => i.isAvailable).length,
    categories: categoriesData.length,
    popularItems: menuItemsData.filter((i) => i.isPopular).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Management"
        description="Manage restaurant menu items and categories"
        actions={
          <div className="flex gap-3">
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new menu category
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="catName">Category Name</Label>
                    <Input id="catName" placeholder="e.g., Appetizers" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catIcon">Icon</Label>
                    <Input id="catIcon" placeholder="e.g., 🥗" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catDesc">Description</Label>
                    <Textarea id="catDesc" placeholder="Category description..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="catActive" defaultChecked />
                    <Label htmlFor="catActive">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddCategoryOpen(false)}>
                    Create Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Create a new item for the restaurant menu
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input id="itemName" placeholder="e.g., Chicken Tikka" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemPrice">Price (NPR)</Label>
                      <Input id="itemPrice" type="number" placeholder="350" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemCategory">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesData.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemPrepTime">Prep Time (minutes)</Label>
                      <Input id="itemPrepTime" type="number" placeholder="15" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemDesc">Description</Label>
                    <Textarea id="itemDesc" placeholder="Item description..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Image className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drop an image here or click to upload
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="itemVeg" />
                      <Label htmlFor="itemVeg" className="flex items-center gap-1">
                        <Leaf className="h-4 w-4 text-green-500" />
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="itemSpicy" />
                      <Label htmlFor="itemSpicy" className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-red-500" />
                        Spicy
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="itemPopular" />
                      <Label htmlFor="itemPopular" className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Popular
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="itemAvailable" defaultChecked />
                    <Label htmlFor="itemAvailable">Available for ordering</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddItemOpen(false)}>
                    Create Item
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
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                🍽️
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Power className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeItems}</p>
                <p className="text-xs text-muted-foreground">Active Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
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
                <p className="text-2xl font-bold">{stats.popularItems}</p>
                <p className="text-xs text-muted-foreground">Popular Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Menu Items Tab */}
        <TabsContent value="items" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesData.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
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

          {/* Items Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className={cn(!item.isAvailable && 'opacity-60')}>
                  <div className="relative h-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {item.isVegetarian && (
                        <Badge className="bg-green-500 h-6">
                          <Leaf className="h-3 w-3" />
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge variant="destructive" className="h-6">
                          <Flame className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    {item.isPopular && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 h-6">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                        <Badge variant="secondary">Unavailable</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.categoryName}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Power className="h-4 w-4 mr-2" />
                            {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">NPR {item.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{item.prepTime} min</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Prep Time</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className={cn(!item.isAvailable && 'opacity-60')}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-10 object-cover rounded"
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>NPR {item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.prepTime} min</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.isVegetarian && (
                              <Badge variant="outline" className="h-6">
                                <Leaf className="h-3 w-3 text-green-500" />
                              </Badge>
                            )}
                            {item.isSpicy && (
                              <Badge variant="outline" className="h-6">
                                <Flame className="h-3 w-3 text-red-500" />
                              </Badge>
                            )}
                            {item.isPopular && (
                              <Badge variant="outline" className="h-6">
                                <Star className="h-3 w-3 text-yellow-500" />
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.isAvailable ? 'success' : 'secondary'}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoriesData.map((category) => (
              <Card key={category.id} className={cn(!category.isActive && 'opacity-60')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.itemCount} items
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Items
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={category.isActive ? 'success' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
