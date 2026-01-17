/**
 * Hotel PMS - Date Picker Component
 * Date picker with popover calendar
 */

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/**
 * DatePicker props
 */
interface DatePickerProps {
  // Selected date
  date?: Date;
  // Callback when date changes
  onDateChange?: (date: Date | undefined) => void;
  // Placeholder text
  placeholder?: string;
  // Date format string
  dateFormat?: string;
  // Disable past dates
  disablePastDates?: boolean;
  // Disable future dates
  disableFutureDates?: boolean;
  // Minimum selectable date
  minDate?: Date;
  // Maximum selectable date
  maxDate?: Date;
  // Disabled state
  disabled?: boolean;
  // Error state
  error?: boolean;
  // Additional class names
  className?: string;
}

/**
 * DatePicker component for single date selection
 */
function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  dateFormat = 'PPP',
  disablePastDates = false,
  disableFutureDates = false,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  className,
}: DatePickerProps) {
  // Calculate disabled dates
  const disabledDays = React.useMemo(() => {
    const disabled: Array<Date | { before: Date } | { after: Date }> = [];
    
    if (disablePastDates) {
      disabled.push({ before: new Date() });
    }
    
    if (disableFutureDates) {
      disabled.push({ after: new Date() });
    }
    
    if (minDate) {
      disabled.push({ before: minDate });
    }
    
    if (maxDate) {
      disabled.push({ after: maxDate });
    }
    
    return disabled;
  }, [disablePastDates, disableFutureDates, minDate, maxDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={disabledDays}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * DateRangePicker props
 */
interface DateRangePickerProps {
  // Selected date range
  dateRange?: { from: Date | undefined; to: Date | undefined };
  // Callback when range changes
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  // Placeholder text
  placeholder?: string;
  // Date format string
  dateFormat?: string;
  // Disable past dates
  disablePastDates?: boolean;
  // Minimum selectable date
  minDate?: Date;
  // Maximum selectable date
  maxDate?: Date;
  // Number of months to display
  numberOfMonths?: number;
  // Disabled state
  disabled?: boolean;
  // Error state
  error?: boolean;
  // Additional class names
  className?: string;
}

/**
 * DateRangePicker component for date range selection
 */
function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = 'Pick a date range',
  dateFormat = 'LLL dd, y',
  disablePastDates = false,
  minDate,
  maxDate,
  numberOfMonths = 2,
  disabled = false,
  error = false,
  className,
}: DateRangePickerProps) {
  // Calculate disabled dates
  const disabledDays = React.useMemo(() => {
    const disabled: Array<Date | { before: Date } | { after: Date }> = [];
    
    if (disablePastDates) {
      disabled.push({ before: new Date() });
    }
    
    if (minDate) {
      disabled.push({ before: minDate });
    }
    
    if (maxDate) {
      disabled.push({ after: maxDate });
    }
    
    return disabled;
  }, [disablePastDates, minDate, maxDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, dateFormat)} -{' '}
                {format(dateRange.to, dateFormat)}
              </>
            ) : (
              format(dateRange.from, dateFormat)
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange as any}
          numberOfMonths={numberOfMonths}
          disabled={disabledDays}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, DateRangePicker };
