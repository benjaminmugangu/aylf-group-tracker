
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
  subWeeks,
  startOfDay,
  endOfDay,
  isValid,
  getYear,
  getMonth
} from 'date-fns';
import type { DateRange } from 'react-day-picker';

export type PredefinedRange = 
  | 'all_time' 
  | 'today' 
  | 'this_week' 
  | 'last_week'
  | 'this_month' 
  | 'this_year'
  | 'specific_year' // New: User selects a specific year
  | 'specific_month' // New: User selects a specific year and month
  | 'last_7_days' 
  | 'last_30_days' 
  | 'last_90_days'
  | 'last_12_months'
  | 'custom';

export interface DateFilterValue {
  rangeKey: PredefinedRange;
  customRange?: DateRange;
  specificYear?: string; // New for specific year selection
  specificMonth?: string; // New for specific month selection (0-11)
  display: string;
}

interface DateRangeFilterProps {
  onFilterChange: (filterValue: DateFilterValue) => void;
  initialRangeKey?: PredefinedRange;
  initialCustomRange?: DateRange;
  initialSpecificYear?: string;
  initialSpecificMonth?: string;
}

const PREDEFINED_RANGES_OPTIONS: { value: PredefinedRange; label: string }[] = [
  { value: 'all_time', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week (Mon-Sun)' },
  { value: 'last_week', label: 'Last Week (Mon-Sun)' },
  { value: 'this_month', label: 'This Month (Current)' },
  { value: 'this_year', label: 'This Year (Current)' },
  { value: 'specific_year', label: 'Specific Year' },
  { value: 'specific_month', label: 'Specific Month' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' },
  { value: 'last_12_months', label: 'Last 12 Months' },
];

const YEAR_OPTIONS = Array.from({ length: (2028 - 2000) + 1 }, (_, i) => {
  const year = (2000 + i).toString();
  return { value: year, label: year };
});

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i.toString(), // 0 for January, 11 for December
  label: format(new Date(0, i), "MMMM"),
}));


export function DateRangeFilter({ 
  onFilterChange, 
  initialRangeKey = 'all_time',
  initialCustomRange,
  initialSpecificYear,
  initialSpecificMonth,
}: DateRangeFilterProps) {
  const [selectedRangeKey, setSelectedRangeKey] = useState<PredefinedRange>(initialRangeKey);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(initialCustomRange);
  const [specificYear, setSpecificYear] = useState<string | undefined>(initialSpecificYear || getYear(new Date()).toString());
  const [specificMonth, setSpecificMonth] = useState<string | undefined>(initialSpecificMonth || getMonth(new Date()).toString());
  const [popoverOpen, setPopoverOpen] = useState(false);

  const getDisplayLabel = (
    rangeKey: PredefinedRange, 
    currentCustomRange?: DateRange,
    currentSpecificYear?: string,
    currentSpecificMonth?: string
  ): string => {
    if (rangeKey === 'custom' && currentCustomRange?.from) {
      if (currentCustomRange.to) {
        return `${format(currentCustomRange.from, "LLL dd, y")} - ${format(currentCustomRange.to, "LLL dd, y")}`;
      }
      return format(currentCustomRange.from, "LLL dd, y");
    }
    if (rangeKey === 'specific_year' && currentSpecificYear) {
      return `Year: ${currentSpecificYear}`;
    }
    if (rangeKey === 'specific_month' && currentSpecificYear && currentSpecificMonth) {
      const monthLabel = MONTH_OPTIONS.find(m => m.value === currentSpecificMonth)?.label || "";
      return `Month: ${monthLabel} ${currentSpecificYear}`;
    }
    return PREDEFINED_RANGES_OPTIONS.find(r => r.value === rangeKey)?.label || "Select Range";
  };
  
  const [displayLabel, setDisplayLabel] = useState<string>(() => getDisplayLabel(initialRangeKey, initialCustomRange, initialSpecificYear, initialSpecificMonth));

  useEffect(() => {
    setDisplayLabel(getDisplayLabel(selectedRangeKey, customDateRange, specificYear, specificMonth));
  }, [selectedRangeKey, customDateRange, specificYear, specificMonth]);

  const triggerFilterChange = (
    key: PredefinedRange,
    custom?: DateRange,
    year?: string,
    month?: string
  ) => {
    const newDisplayLabel = getDisplayLabel(key, custom, year, month);
    setDisplayLabel(newDisplayLabel);
    onFilterChange({ 
      rangeKey: key, 
      customRange: custom,
      specificYear: year,
      specificMonth: month,
      display: newDisplayLabel 
    });
  };
  
  const handlePredefinedRangeChange = (value: PredefinedRange) => {
    setSelectedRangeKey(value);
    setCustomDateRange(undefined); // Clear custom range
    // If switching to specific year/month, keep current year/month or default
    if (value === 'specific_year') {
      const yearToUse = specificYear || getYear(new Date()).toString();
      setSpecificYear(yearToUse);
      triggerFilterChange(value, undefined, yearToUse, undefined);
    } else if (value === 'specific_month') {
      const yearToUse = specificYear || getYear(new Date()).toString();
      const monthToUse = specificMonth || getMonth(new Date()).toString();
      setSpecificYear(yearToUse);
      setSpecificMonth(monthToUse);
      triggerFilterChange(value, undefined, yearToUse, monthToUse);
    } else {
      setSpecificYear(undefined); // Clear specific year/month for other predefined ranges
      setSpecificMonth(undefined);
      triggerFilterChange(value, undefined, undefined, undefined);
    }
  };

  const handleCustomDateChange = (date: DateRange | undefined) => {
    setCustomDateRange(date);
    if (date?.from) {
      setSelectedRangeKey('custom'); 
      setSpecificYear(undefined); // Clear specific year/month
      setSpecificMonth(undefined);
      triggerFilterChange('custom', date, undefined, undefined);
      if (date.to || !date.from) { 
         setPopoverOpen(false);
      }
    } else { 
        handlePredefinedRangeChange('all_time'); 
    }
  };

  const handleSpecificYearChange = (year: string) => {
    setSpecificYear(year);
    setSelectedRangeKey('specific_year'); // Ensure correct range key
    setCustomDateRange(undefined); // Clear custom range
    if (selectedRangeKey === 'specific_month') { // if month was also set, update with new year
        triggerFilterChange('specific_month', undefined, year, specificMonth);
    } else {
        triggerFilterChange('specific_year', undefined, year, undefined);
    }
  };

  const handleSpecificMonthChange = (month: string) => {
    setSpecificMonth(month);
    setSelectedRangeKey('specific_month'); // Ensure correct range key
    setCustomDateRange(undefined); // Clear custom range
    const yearToUse = specificYear || getYear(new Date()).toString(); // Ensure year is set
    if (!specificYear) setSpecificYear(yearToUse);
    triggerFilterChange('specific_month', undefined, yearToUse, month);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
      <Select value={selectedRangeKey} onValueChange={(value) => handlePredefinedRangeChange(value as PredefinedRange)}>
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

      {(selectedRangeKey === 'specific_year' || selectedRangeKey === 'specific_month') && (
        <Select value={specificYear} onValueChange={handleSpecificYearChange}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedRangeKey === 'specific_month' && (
        <Select value={specificMonth} onValueChange={handleSpecificMonthChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
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
            disabled={(date) => { // Disable calendar if specific_year or specific_month is chosen
                return selectedRangeKey === 'specific_year' || selectedRangeKey === 'specific_month';
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function getDateRangeFromFilterValue(filterValue: DateFilterValue): { startDate?: Date, endDate?: Date } {
  if (filterValue.rangeKey === 'all_time' && !filterValue.customRange && !filterValue.specificYear && !filterValue.specificMonth) {
    return {};
  }

  let startDate: Date | undefined;
  let endDate: Date | undefined; 

  if (filterValue.rangeKey === 'custom' && filterValue.customRange?.from) {
    startDate = startOfDay(filterValue.customRange.from);
    endDate = filterValue.customRange.to ? endOfDay(filterValue.customRange.to) : endOfDay(filterValue.customRange.from);
  } else if (filterValue.rangeKey === 'specific_year' && filterValue.specificYear) {
      const yearNum = parseInt(filterValue.specificYear, 10);
      if (!isNaN(yearNum)) {
        startDate = startOfYear(new Date(yearNum, 0, 1));
        endDate = endOfYear(new Date(yearNum, 11, 31));
      }
  } else if (filterValue.rangeKey === 'specific_month' && filterValue.specificYear && filterValue.specificMonth) {
      const yearNum = parseInt(filterValue.specificYear, 10);
      const monthNum = parseInt(filterValue.specificMonth, 10); // 0-11
      if (!isNaN(yearNum) && !isNaN(monthNum) && monthNum >=0 && monthNum <=11) {
        startDate = startOfMonth(new Date(yearNum, monthNum, 1));
        endDate = endOfMonth(new Date(yearNum, monthNum, 1));
      }
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
      case 'last_week': 
        startDate = startOfDay(startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }));
        endDate = endOfDay(endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }));
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
        startDate = startOfDay(startOfMonth(subMonths(now, 11))); // Start of the month, 11 months ago
        endDate = endOfDay(now); // End of today
        break;
      default: 
        return {}; 
    }
  }
  
  // Validate dates
  if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
    return { startDate, endDate };
  }
  console.warn("Date calculation resulted in invalid dates for filter:", filterValue);
  return {}; // Return empty if dates are not valid
}


export function applyDateFilter<T extends { date?: string; submissionDate?: string; joinDate?: string }>(
  items: T[],
  filterValue: DateFilterValue | undefined
): T[] {
  if (!items) return [];
  if (!filterValue || (filterValue.rangeKey === 'all_time' && !filterValue.customRange && !filterValue.specificYear && !filterValue.specificMonth)) {
    return items;
  }

  const { startDate, endDate } = getDateRangeFromFilterValue(filterValue);

  if (!startDate || !endDate) { // If date calculation failed or returned empty (e.g. for invalid specificYear/Month)
     if (filterValue.rangeKey === 'all_time') return items; // only return all items if it was explicitly all_time
     return []; // otherwise, if a filter was intended but failed, return no items
  }
  
  return items.filter(item => {
    const itemDateStr = item.date || item.submissionDate || item.joinDate;
    if (!itemDateStr) return false; 
    
    try {
      const itemDate = new Date(itemDateStr);
      if (!isValid(itemDate)) { // Check if date is valid
          console.warn(`Invalid date string found during filtering: ${itemDateStr}`);
          return false;
      }
      // Ensure comparison is inclusive by comparing itemDate against startOfDay(startDate) and endOfDay(endDate) effectively
      return itemDate >= startDate && itemDate <= endDate;
    } catch (e) {
      console.error(`Error parsing date during filtering: ${itemDateStr}`, e);
      return false;
    }
  });
}

