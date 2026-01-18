/**
 * Hotel PMS - Public Menu Page (Guest Facing)
 * Allows guests to browse menu and add items to cart
 */

import * as React from 'react';
import {
    Search,
    Grid,
    List,
    Leaf,
    Flame,
    Star,
    ShoppingCart,
    Plus,
    Croissant,
    Utensils,
    Soup,
    Pizza,
    Beef,
    Coffee,
    Cake,
    LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { mockCategories, mockMenuItems, MenuItem } from '@/data/mockData';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    'Croissant': Croissant,
    'Utensils': Utensils,
    'Soup': Soup,
    'Pizza': Pizza,
    'Beef': Beef,
    'Coffee': Coffee,
    'Cake': Cake,
};

/**
 * PublicMenuPage component
 */
export default function PublicMenuPage() {
    const navigate = useNavigate();

    // State
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
    const [cartCount, setCartCount] = React.useState(0);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filter menu items
    const filteredItems = React.useMemo(() => {
        return mockMenuItems.filter((item) => {
            // Only show active/available items to guests
            if (!item.isAvailable) return false;

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

    const handleAddToCart = (item: MenuItem) => {
        setCartCount(prev => prev + 1);
        // In a real app, this would update a cart context/store
        console.log(`Added ${item.name} to cart`);
    };

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Our Menu"
                description="Freshly prepared delicious meals for you"
                actions={
                    <Button onClick={() => navigate('/cart')} className="relative">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Cart
                        {cartCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                {cartCount}
                            </Badge>
                        )}
                    </Button>
                }
            />

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 flex flex-wrap h-auto gap-2 bg-transparent p-0 justify-start">
                    <TabsTrigger
                        value="all"
                        onClick={() => setCategoryFilter('all')}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border"
                    >
                        All Items
                    </TabsTrigger>
                    {mockCategories.map(cat => {
                        const Icon = iconMap[cat.icon] || Utensils;
                        return (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.id}
                                onClick={() => setCategoryFilter(cat.id)}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border flex items-center gap-2"
                            >
                                <Icon className="h-4 w-4" /> {cat.name}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search delicious food..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex border rounded-lg p-1 shrink-0">
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
            <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
                {filteredItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className={cn("relative", viewMode === 'list' ? "md:w-48 h-48 md:h-auto shrink-0" : "h-48")}>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 flex gap-1">
                                {item.isVegetarian && (
                                    <Badge className="bg-green-500/90 backdrop-blur-sm h-6">
                                        <Leaf className="h-3 w-3" />
                                    </Badge>
                                )}
                                {item.isSpicy && (
                                    <Badge variant="destructive" className="bg-destructive/90 backdrop-blur-sm h-6">
                                        <Flame className="h-3 w-3" />
                                    </Badge>
                                )}
                            </div>
                            {item.isPopular && (
                                <Badge className="absolute top-2 right-2 bg-yellow-500/90 backdrop-blur-sm h-6">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    Popular
                                </Badge>
                            )}
                        </div>

                        <CardContent className="p-4 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-xs text-muted-foreground">{item.categoryName} • {item.prepTime} min</p>
                                </div>
                                <p className="font-bold text-primary text-lg">NPR {item.price}</p>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                                {item.description}
                            </p>

                            <Button className="w-full mt-auto" onClick={() => handleAddToCart(item)}>
                                <Plus className="h-4 w-4 mr-2" /> Add to Order
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">No menu items found matching your search.</p>
                    <Button
                        variant="link"
                        onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
