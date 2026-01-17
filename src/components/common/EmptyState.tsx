/**
 * Hotel PMS - Empty State Component
 * Display when no data is available
 */

import React from 'react';
import { LucideIcon, Package, Search, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * EmptyState props
 */
export interface EmptyStateProps {
  // Icon to display - can be a LucideIcon or a React element
  icon?: LucideIcon | React.ReactElement;
  // Title text
  title: string;
  // Description text
  description?: string;
  // Primary action button - can be an object or a React element
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  } | React.ReactElement;
  // Secondary action button
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  // Additional class names
  className?: string;
  // Size variant
  size?: 'sm' | 'default' | 'lg';
  // Visual variant (for different use cases)
  variant?: 'default' | 'search' | 'error' | 'empty' | 'bookings' | 'rooms' | 'orders' | 'guests';
}

/**
 * EmptyState component
 */
export function EmptyState({
  icon = Package,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'default',
  variant: _variant = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-10 w-10',
      iconWrapper: 'h-16 w-16',
      title: 'text-base',
      description: 'text-sm',
    },
    default: {
      container: 'py-12',
      icon: 'h-12 w-12',
      iconWrapper: 'h-20 w-20',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      icon: 'h-16 w-16',
      iconWrapper: 'h-24 w-24',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size].container,
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mb-4 flex items-center justify-center rounded-full bg-muted',
          sizeClasses[size].iconWrapper
        )}
      >
        {React.isValidElement(icon) ? (
          icon
        ) : (
          React.createElement(icon as LucideIcon, {
            className: cn('text-muted-foreground', sizeClasses[size].icon)
          })
        )}
      </div>

      {/* Title */}
      <h3
        className={cn(
          'font-semibold text-foreground',
          sizeClasses[size].title
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'mt-1 max-w-sm text-muted-foreground',
            sizeClasses[size].description
          )}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-6 flex gap-3">
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            React.isValidElement(action) ? (
              action
            ) : (
              <Button onClick={(action as { label: string; onClick: () => void; icon?: LucideIcon }).onClick}>
                {(action as { label: string; onClick: () => void; icon?: LucideIcon }).icon && (
                  <span className="mr-2 h-4 w-4">
                    {React.createElement((action as { icon: LucideIcon }).icon, { className: 'h-4 w-4' })}
                  </span>
                )}
                {(action as { label: string; onClick: () => void }).label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured empty state for search results
 */
export function NoSearchResults({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        searchTerm
          ? `No results found for "${searchTerm}". Try adjusting your search.`
          : 'No results match your search criteria.'
      }
      action={
        onClear
          ? {
              label: 'Clear search',
              onClick: onClear,
            }
          : undefined
      }
    />
  );
}

/**
 * Pre-configured empty state for no data
 */
export function NoData({
  title = 'No data available',
  description = 'There is no data to display at this time.',
  action,
}: {
  title?: string;
  description?: string;
  action?: EmptyStateProps['action'];
}) {
  return (
    <EmptyState
      icon={FileQuestion}
      title={title}
      description={description}
      action={action}
    />
  );
}

/**
 * Pre-configured empty state for rooms
 */
export function NoRooms({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No rooms available"
      description="There are no rooms available for the selected dates. Try different dates or contact the hotel directly."
      action={
        onAdd
          ? {
              label: 'Add Room',
              onClick: onAdd,
            }
          : undefined
      }
    />
  );
}

/**
 * Pre-configured empty state for bookings
 */
export function NoBookings({ onBook }: { onBook?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No bookings yet"
      description="You haven't made any bookings yet. Start exploring our rooms and make your first reservation!"
      action={
        onBook
          ? {
              label: 'Browse Rooms',
              onClick: onBook,
            }
          : undefined
      }
    />
  );
}

/**
 * Pre-configured empty state for orders
 */
export function NoOrders({ onOrder }: { onOrder?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No orders yet"
      description="You haven't placed any orders yet. Check out our menu and order something delicious!"
      action={
        onOrder
          ? {
              label: 'View Menu',
              onClick: onOrder,
            }
          : undefined
      }
    />
  );
}
