/**
 * Hotel PMS - Textarea Component
 * Multi-line text input field
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea props extending native textarea attributes
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Error state styling
  error?: boolean;
  // Error message to display
  errorMessage?: string;
  // Character count display
  showCount?: boolean;
  // Maximum character length
  maxLength?: number;
}

/**
 * Textarea component for multi-line input
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      errorMessage,
      showCount,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    // Track character count
    const [count, setCount] = React.useState(
      typeof value === 'string' ? value.length : 0
    );

    // Handle change with character count
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      onChange?.(e);
    };

    // Update count when value changes externally
    React.useEffect(() => {
      if (typeof value === 'string') {
        setCount(value.length);
      }
    }, [value]);

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {/* Character count display */}
        {showCount && maxLength && (
          <div
            className={cn(
              'absolute bottom-2 right-3 text-xs text-muted-foreground',
              count >= maxLength && 'text-destructive'
            )}
          >
            {count}/{maxLength}
          </div>
        )}
        {/* Error message */}
        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
