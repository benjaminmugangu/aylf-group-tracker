// src/components/shared/DateRangeFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from 'lucide-react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subDays, 
  subMonths,
  startOfDay,
  endOfDay
} from 'date-fns';
import type { DateRange } from 'react-day-picker';

export type PredefinedRange = 
  | 'all_time' 
  | 'today' 
  | 'this_week' 
  | 'this_month' 
  | 'this_year' 
  | 'last_7_days' 
  | 'last_30_days' 
  | 'last_90_days'
  | 'last_12_months'
  | 'custom';

export interface DateFilterValue {
  rangeKey: PredefinedRange;
  customRange?: DateRange;
  display: string;
}

interface DateRangeFilterProps {
  onFilterChange: (filterValue: DateFilterValue) => void;
  initialRangeKey?: PredefinedRange;
  initialCustomRange?: DateRange;
}

const PREDEFINED_RANGES_OPTIONS: { value: PredefinedRange; label: string }[] = [
  { value: 'all_time', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' },
  { value: 'last_12_months', label: 'Last 12 Months' },
];


export function DateRangeFilter({ 
  onFilterChange, 
  initialRangeKey = 'all_time',
  initialCustomRange 
}: DateRangeFilterProps) {
  const [selectedRangeKey, setSelectedRangeKey] = useState<PredefinedRange>(initialRangeKey);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(initialCustomRange);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const getDisplayLabel = (rangeKey: PredefinedRange, customRange?: DateRange): string => {
    if (rangeKey === 'custom' && customRange?.from) {
      if (customRange.to) {
        return `${format(customRange.from, "LLL dd, y")} - ${format(customRange.to, "LLL dd, y")}`;
      }
      return format(customRange.from, "LLL dd, y");
    }
    return PREDEFINED_RANGES_OPTIONS.find(r => r.value === rangeKey)?.label || "Select Range";
  };

  const [displayLabel, setDisplayLabel] = useState<string>(() => getDisplayLabel(initialRangeKey, initialCustomRange));

  useEffect(() => {
    // Effect to synchronize displayLabel when initial props change or state is set internally
    setDisplayLabel(getDisplayLabel(selectedRangeKey, customDateRange));
  }, [selectedRangeKey, customDateRange]);


  const handlePredefinedRangeChange = (value: PredefinedRange) => {
    setSelectedRangeKey(value);
    setCustomDateRange(undefined);
    const newDisplayLabel = getDisplayLabel(value, undefined);
    setDisplayLabel(newDisplayLabel);
    onFilterChange({ rangeKey: value, display: newDisplayLabel });
  };

  const handleCustomDateChange = (date: DateRange | undefined) => {
    setCustomDateRange(date);
    if (date?.from) {
      const newRangeKey: PredefinedRange = 'custom';
      setSelectedRangeKey(newRangeKey); // Mark that a custom range is active
      const newDisplayLabel = getDisplayLabel(newRangeKey, date);
      setDisplayLabel(newDisplayLabel);
      onFilterChange({ rangeKey: newRangeKey, customRange: date, display: newDisplayLabel });
      if (date.to || !date.from) { // Close if range complete or cleared
         setPopoverOpen(false);
      }
    } else { // Custom date cleared
        handlePredefinedRangeChange('all_time'); // Revert to 'all_time' or some default
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <Select value={selectedRangeKey === 'custom' ? 'all_time' : selectedRangeKey} onValueChange={(value) => handlePredefinedRangeChange(value as PredefinedRange)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          {PREDEFINED_RANGES_OPTIONS.map(range => (
            <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto min-w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={customDateRange}
            onSelect={handleCustomDateChange}
            initialFocus
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function getDateRangeFromFilterValue(filterValue: DateFilterValue): { startDate?: Date, endDate?: Date } {
  if (filterValue.rangeKey === 'all_time' && !filterValue.customRange) {
    return {};
  }

  let startDate: Date | undefined;
  let endDate: Date | undefined = new Date(); 

  if (filterValue.rangeKey === 'custom' && filterValue.customRange?.from) {
    startDate = startOfDay(filterValue.customRange.from);
    endDate = filterValue.customRange.to ? endOfDay(filterValue.customRange.to) : endOfDay(filterValue.customRange.from);
  } else {
    const now = new Date();
    switch (filterValue.rangeKey) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'this_week':
        startDate = startOfWeek(now, { weekStartsOn: 1 }); 
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'this_month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'this_year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case 'last_7_days':
        startDate = startOfDay(subDays(now, 6)); 
        endDate = endOfDay(now);
        break;
      case 'last_30_days':
        startDate = startOfDay(subDays(now, 29));
        endDate = endOfDay(now);
        break;
      case 'last_90_days':
        startDate = startOfDay(subDays(now, 89));
        endDate = endOfDay(now);
        break;
      case 'last_12_months':
        startDate = startOfDay(startOfMonth(subMonths(now, 11)));
        endDate = endOfDay(now);
        break;
      default: // all_time or unhandled
        return {}; 
    }
  }
  return { startDate, endDate };
}


// Helper function to apply date filtering to an array of items
export function applyDateFilter<T extends { date?: string; submissionDate?: string; joinDate?: string }>(
  items: T[],
  filterValue: DateFilterValue | undefined
): T[] {
  if (!items) return [];
  if (!filterValue || (filterValue.rangeKey === 'all_time' && !filterValue.customRange) ) {
    return items;
  }

  const { startDate, endDate } = getDateRangeFromFilterValue(filterValue);

  if (!startDate || !endDate) return items;
  
  return items.filter(item => {
    const itemDateStr = item.date || item.submissionDate || item.joinDate;
    if (!itemDateStr) return false; // Item doesn't have a date field relevant for filtering
    
    try {
      const itemDate = new Date(itemDateStr);
      if (isNaN(itemDate.getTime())) {
          console.warn(`Invalid date string found during filtering: ${itemDateStr}`);
          return false;
      }
      return itemDate >= startDate && itemDate <= endDate;
    } catch (e) {
      console.error(`Error parsing date during filtering: ${itemDateStr}`, e);
      return false;
    }
  });
}
