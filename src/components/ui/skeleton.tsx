/**
 * Hotel PMS - Skeleton Component
 * Loading placeholder skeleton component
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton component props
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  // Variant shapes
  variant?: 'default' | 'circular' | 'text' | 'card' | 'avatar';
  // Animation type
  animation?: 'pulse' | 'shimmer' | 'none';
}

/**
 * Skeleton component for loading states
 */
function Skeleton({
  className,
  variant = 'default',
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  // Variant-specific classes
  const variantClasses = {
    default: '',
    circular: 'rounded-full',
    text: 'h-4 rounded',
    card: 'h-32 rounded-lg',
    avatar: 'h-10 w-10 rounded-full',
  };

  // Animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-muted',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    />
  );
}

/**
 * Pre-built skeleton components for common use cases
 */

// Text skeleton (single line)
function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="text" className={cn('h-4 w-full', className)} {...props} />;
}

// Title skeleton (larger text)
function SkeletonTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="text" className={cn('h-6 w-3/4', className)} {...props} />;
}

// Avatar skeleton
function SkeletonAvatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="avatar" className={cn('h-10 w-10', className)} {...props} />;
}

// Button skeleton
function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('h-10 w-24 rounded-md', className)} {...props} />;
}

// Card skeleton
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3 rounded-lg border p-4', className)} {...props}>
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

// Table row skeleton
function SkeletonTableRow({
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { columns?: number }) {
  return (
    <div className={cn('flex gap-4 py-3', className)} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

// Room card skeleton
function SkeletonRoomCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3 rounded-lg border p-4', className)} {...props}>
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}

// Menu item skeleton
function SkeletonMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex gap-4 rounded-lg border p-4', className)} {...props}>
      <Skeleton className="h-20 w-20 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonTitle,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonRoomCard,
  SkeletonMenuItem,
};
