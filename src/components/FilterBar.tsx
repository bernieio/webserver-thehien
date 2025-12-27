/**
 * FilterBar Component
 * Bộ lọc ngày tháng và loại log - Style giống trang Thống kê
 */

import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getToday, getDaysAgo } from '@/utils/formatters';

interface FilterBarProps {
  startDate: string;
  endDate: string;
  logType?: string;
  logLevel?: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onLogTypeChange?: (value: string) => void;
  onLogLevelChange?: (value: string) => void;
  showLogFilters?: boolean;
  onSearch?: () => void;
}

export default function FilterBar({
  startDate,
  endDate,
  logType,
  logLevel,
  onStartDateChange,
  onEndDateChange,
  onLogTypeChange,
  onLogLevelChange,
  showLogFilters = false,
  onSearch,
}: FilterBarProps) {
  // Convert string dates to Date objects for calendar
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : undefined
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : undefined
  );

  // Sync internal state with props
  useEffect(() => {
    if (startDate) {
      setSelectedStartDate(parse(startDate, 'yyyy-MM-dd', new Date()));
    } else {
      setSelectedStartDate(undefined);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setSelectedEndDate(parse(endDate, 'yyyy-MM-dd', new Date()));
    } else {
      setSelectedEndDate(undefined);
    }
  }, [endDate]);

  const presets = [
    { label: 'Hôm nay', start: getToday(), end: getToday() },
    { label: '7 ngày', start: getDaysAgo(7), end: getToday() },
    { label: '30 ngày', start: getDaysAgo(30), end: getToday() },
    { label: '90 ngày', start: getDaysAgo(90), end: getToday() },
  ];

  const applyPreset = (preset: { start: string; end: string }) => {
    onStartDateChange(preset.start);
    onEndDateChange(preset.end);
  };

  const clearFilters = () => {
    onStartDateChange('');
    onEndDateChange('');
    if (onLogTypeChange) onLogTypeChange('');
    if (onLogLevelChange) onLogLevelChange('');
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setSelectedStartDate(date);
    if (date) {
      onStartDateChange(format(date, 'yyyy-MM-dd'));
    } else {
      onStartDateChange('');
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setSelectedEndDate(date);
    if (date) {
      onEndDateChange(format(date, 'yyyy-MM-dd'));
    } else {
      onEndDateChange('');
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-6 bg-card border border-border rounded-lg">
      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-xl font-medium text-foreground">Từ ngày</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left text-xl h-12",
                !selectedStartDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedStartDate ? format(selectedStartDate, "dd/MM/yyyy") : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedStartDate}
              onSelect={handleStartDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <label className="text-xl font-medium text-foreground">Đến ngày</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left text-xl h-12",
                !selectedEndDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedEndDate ? format(selectedEndDate, "dd/MM/yyyy") : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedEndDate}
              onSelect={handleEndDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-xl font-medium text-foreground opacity-0">Nhanh</label>
        <div className="flex gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant={startDate === preset.start && endDate === preset.end ? "default" : "outline"}
              onClick={() => applyPreset(preset)}
              className="h-12 px-4 text-xl"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Log Type Filter */}
      {showLogFilters && onLogTypeChange && (
        <div className="space-y-2">
          <label className="text-xl font-medium text-foreground">Loại</label>
          <select
            value={logType || ''}
            onChange={(e) => onLogTypeChange(e.target.value)}
            className="h-12 text-xl px-4 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Tất cả</option>
            <option value="activity">Hoạt động</option>
            <option value="server">Máy chủ</option>
            <option value="error">Lỗi</option>
          </select>
        </div>
      )}

      {/* Log Level Filter */}
      {showLogFilters && onLogLevelChange && (
        <div className="space-y-2">
          <label className="text-xl font-medium text-foreground">Mức</label>
          <select
            value={logLevel || ''}
            onChange={(e) => onLogLevelChange(e.target.value)}
            className="h-12 text-xl px-4 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Tất cả</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <label className="text-xl font-medium text-foreground opacity-0">Hành động</label>
        <div className="flex gap-3">
          {onSearch && (
            <Button 
              onClick={onSearch} 
              className="h-12 px-6 text-xl"
            >
              <Search className="mr-2 h-5 w-5" />
              Tìm kiếm
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-12 px-6 text-xl"
          >
            <X className="mr-2 h-5 w-5" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
}
