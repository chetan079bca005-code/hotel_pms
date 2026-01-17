/**
 * Hotel PMS - useDebounce Hook
 * Debounce hook for delayed value updates
 */

import * as React from 'react';

/**
 * useDebounce - Debounce a value with specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    // Set up a timer to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer on value change or unmount
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback - Debounce a callback function
 * @param callback - The callback to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = React.useRef(callback);

  // Update callback ref when callback changes
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return React.useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * useThrottle - Throttle a value with specified interval
 * @param value - The value to throttle
 * @param interval - Interval in milliseconds
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastExecuted = React.useRef<number>(Date.now());

  React.useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * useThrottledCallback - Throttle a callback function
 * @param callback - The callback to throttle
 * @param interval - Interval in milliseconds
 * @returns Throttled callback
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 500
): (...args: Parameters<T>) => void {
  const lastExecuted = React.useRef<number>(0);
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now >= lastExecuted.current + interval) {
        lastExecuted.current = now;
        callbackRef.current(...args);
      }
    },
    [interval]
  );
}
