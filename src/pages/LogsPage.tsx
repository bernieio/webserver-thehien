/**
 * Tab Kết quả - Logs Page
 * Hiển thị 3 panel ngang: INFO, WARNING, DEBUG
 */

import { useState } from 'react';
import FilterBar from '@/components/FilterBar';
import LogsPanelGrid from '@/components/LogsPanelGrid';

export default function LogsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Kết quả - Nhật ký</h1>
        <p className="text-[#666666] mt-1">
          Xem lịch sử nhật ký theo từng loại
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        showLogFilters={false}
      />

      {/* 3 Log Panels Grid */}
      <LogsPanelGrid startDate={startDate} endDate={endDate} />
    </div>
  );
}
