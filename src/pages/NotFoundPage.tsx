/**
 * Hotel PMS - 404 Not Found Page
 * Displayed when a route is not matched
 */

import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

/**
 * NotFoundPage component
 * Displays a friendly 404 error page with navigation options
 */
export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-muted-foreground/20 leading-none select-none">
            404
          </div>
          <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 text-primary" />
        </div>
        
        {/* Error message */}
        <h1 className="text-3xl font-bold mb-2">
          {t('errors.notFound')}
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button asChild>
            <Link to="/" className="inline-flex items-center">
              <Home className="h-4 w-4 mr-2" />
              <span>{t('nav.home')}</span>
            </Link>
          </Button>
        </div>
        
        {/* Search suggestion */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/rooms" className="text-sm text-primary hover:underline">
              Browse Rooms
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/menu" className="text-sm text-primary hover:underline">
              View Menu
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/my-bookings" className="text-sm text-primary hover:underline">
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
