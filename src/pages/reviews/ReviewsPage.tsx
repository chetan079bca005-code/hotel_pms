/**
 * Hotel PMS - Admin Reviews Management Page
 * Manage guest reviews and feedback
 */

import * as React from 'react';
import {
  Search,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Reply,
  Flag,
  Trash2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PageHeader, EmptyState } from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  mockReviews,
  Review,
  ReviewCategory
} from '@/data/mockData';


/**
 * Category config
 */
const categoryConfig: Record<ReviewCategory, { label: string; color: string }> = {
  room: { label: 'Room', color: 'bg-blue-100 text-blue-700' },
  restaurant: { label: 'Restaurant', color: 'bg-green-100 text-green-700' },
  service: { label: 'Service', color: 'bg-purple-100 text-purple-700' },
  amenities: { label: 'Amenities', color: 'bg-yellow-100 text-yellow-700' },
};

const reviewsData = mockReviews;

/**
 * Rating distribution
 */
const ratingDistribution = [
  { stars: 5, count: 245, percentage: 48 },
  { stars: 4, count: 156, percentage: 31 },
  { stars: 3, count: 65, percentage: 13 },
  { stars: 2, count: 28, percentage: 5 },
  { stars: 1, count: 15, percentage: 3 },
];

/**
 * AdminReviewsPage component
 */
export default function AdminReviewsPage() {
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
  const [responseText, setResponseText] = React.useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter reviews
  const filteredReviews = React.useMemo(() => {
    return reviewsData.filter((review) => {
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        if (
          !review.guestName.toLowerCase().includes(search) &&
          !review.title.toLowerCase().includes(search) &&
          !review.content.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (ratingFilter !== 'all' && review.rating !== parseInt(ratingFilter)) {
        return false;
      }

      if (categoryFilter !== 'all' && review.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [debouncedSearch, ratingFilter, categoryFilter]);

  // Stats
  const totalReviews = reviewsData.length;
  const avgRating = (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
  const pendingResponses = reviewsData.filter((r) => !r.response).length;
  const flaggedReviews = reviewsData.filter((r) => r.isFlagged).length;

  // Render stars
  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews & Feedback"
        description="Manage guest reviews and respond to feedback"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reviews
          </Button>
        }
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{avgRating}</p>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(parseFloat(avgRating))}
                  <span className="text-sm text-muted-foreground">
                    ({totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <Badge variant="success" className="mt-3">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 vs last month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalReviews}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Badge variant="success" className="mt-3">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18 this month
            </Badge>
          </CardContent>
        </Card>

        <Card className={cn(pendingResponses > 0 && 'border-yellow-200 bg-yellow-50/50')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{pendingResponses}</p>
                <p className="text-sm text-muted-foreground">Pending Responses</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Reply className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            {pendingResponses > 0 && (
              <Badge variant="warning" className="mt-3">
                Action needed
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className={cn(flaggedReviews > 0 && 'border-red-200 bg-red-50/50')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{flaggedReviews}</p>
                <p className="text-sm text-muted-foreground">Flagged Reviews</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
            </div>
            {flaggedReviews > 0 && (
              <Badge variant="destructive" className="mt-3">
                Review needed
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown by star rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="font-medium">{item.stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <Progress value={item.percentage} className="flex-1 h-3" />
                <span className="text-sm text-muted-foreground w-12">
                  {item.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest guest feedback</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Filters */}
            <div className="p-4 border-b flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviews */}
            <div className="divide-y">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors',
                    review.isFlagged && 'bg-red-50/50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.guestName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.guestName}</span>
                          {review.isVerified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                          {review.isFlagged && (
                            <Badge variant="destructive" className="text-xs">
                              <Flag className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {renderStars(review.rating)}
                          <span>•</span>
                          <span>{formatDate(review.createdAt)}</span>
                          <span>•</span>
                          <Badge className={categoryConfig[review.category].color}>
                            {categoryConfig[review.category].label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {!review.response && (
                          <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Respond
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Flag className="h-4 w-4 mr-2" />
                          {review.isFlagged ? 'Unflag' : 'Flag'} Review
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h4 className="font-medium mb-1">{review.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {review.content}
                  </p>

                  {review.response && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground mb-1">
                        Hotel Response • {formatDate(review.responseDate!)}
                      </p>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}

                  {!review.response && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Detail/Response Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle>Review Details</DialogTitle>
                <DialogDescription>
                  {selectedReview.guestName} • {formatDate(selectedReview.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Rating & Category */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(selectedReview.rating, 'md')}
                    <span className="font-medium">{selectedReview.rating}/5</span>
                  </div>
                  <Badge className={categoryConfig[selectedReview.category].color}>
                    {categoryConfig[selectedReview.category].label}
                  </Badge>
                  {selectedReview.isVerified && (
                    <Badge variant="secondary">Verified Stay</Badge>
                  )}
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="font-semibold mb-2">{selectedReview.title}</h4>
                  <p className="text-muted-foreground">{selectedReview.content}</p>
                </div>

                {/* Existing Response */}
                {selectedReview.response ? (
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground mb-2">
                      Your Response • {formatDate(selectedReview.responseDate!)}
                    </p>
                    <p>{selectedReview.response}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="response">Write a Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Thank your guest and address their feedback..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your response will be visible to all guests viewing this review.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedReview(null)}>
                  Close
                </Button>
                {!selectedReview.response && (
                  <Button onClick={() => setSelectedReview(null)}>
                    Submit Response
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
