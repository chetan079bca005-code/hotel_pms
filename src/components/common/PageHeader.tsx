/**
 * Hotel PMS - Page Header Component
 * Consistent page header with title, description, and actions
 */

import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * PageHeader props
 */
export interface PageHeaderProps {
  // Page title
  title: string;
  // Page description
  description?: string;
  // Show back button
  showBack?: boolean;
  // Custom back URL
  backUrl?: string;
  // Actions to display on the right
  actions?: React.ReactNode;
  // Breadcrumb items
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  // Additional class names
  className?: string;
  // Children to render below header
  children?: React.ReactNode;
}

/**
 * PageHeader component
 */
export function PageHeader({
  title,
  description,
  showBack = false,
  backUrl,
  actions,
  breadcrumbs,
  className,
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn('mb-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="mx-1">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(crumb.href!);
                  }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Back button */}
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}

          {/* Title and description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Additional content */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * Section header for content sections
 */
export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
