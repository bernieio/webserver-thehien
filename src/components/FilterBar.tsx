/**
 * FilterBar Component
 * Bộ lọc ngày tháng và loại log
 */

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
}: FilterBarProps) {
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

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#666666]">Từ:</label>
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="text-sm px-2 py-1 border border-[#e5e5e5] rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-[#666666]">Đến:</label>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="text-sm px-2 py-1 border border-[#e5e5e5] rounded"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex gap-1">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                startDate === preset.start && endDate === preset.end
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'border-[#e5e5e5] hover:border-[#1a1a1a]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Log Type Filter */}
        {showLogFilters && onLogTypeChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#666666]">Loại:</label>
            <select
              value={logType || ''}
              onChange={(e) => onLogTypeChange(e.target.value)}
              className="text-sm px-2 py-1 border border-[#e5e5e5] rounded"
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
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#666666]">Mức:</label>
            <select
              value={logLevel || ''}
              onChange={(e) => onLogLevelChange(e.target.value)}
              className="text-sm px-2 py-1 border border-[#e5e5e5] rounded"
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

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          className="text-sm text-[#666666] hover:text-[#1a1a1a] underline"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
