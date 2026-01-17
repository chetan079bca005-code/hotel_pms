/**
 * Hotel PMS - Error Boundary Component
 * Catches JavaScript errors in child component tree
 */

import * as React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  // Custom fallback component
  fallback?: React.ReactNode;
  // Callback when error occurs
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  // Show detailed error info (for development)
  showDetails?: boolean;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary class component for catching render errors
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Call optional error callback
    this.props.onError?.(error, errorInfo);
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Please try again or contact support if
                the problem persists.
              </CardDescription>
            </CardHeader>
            
            {/* Show error details in development */}
            {this.props.showDetails && this.state.error && (
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <p className="mb-2 font-mono text-sm font-semibold text-destructive">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="max-h-40 overflow-auto text-xs text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </CardContent>
            )}
            
            <CardFooter className="flex justify-center gap-2">
              <Button variant="outline" onClick={this.handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button onClick={this.handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component
 */
interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-4 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <div>
        <h3 className="font-semibold">Failed to load</h3>
        <p className="text-sm text-muted-foreground">
          {error?.message || 'An error occurred'}
        </p>
      </div>
      {resetError && (
        <Button variant="outline" size="sm" onClick={resetError}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
