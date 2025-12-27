/**
 * Tab Kết quả - Ảnh Page
 * Hiển thị danh sách ảnh theo dạng List/Grid như Google Drive
 */

import { useState } from 'react';
import FilterBar from '@/components/FilterBar';
import ImageManager from '@/components/ImageManager';

export default function ImagesPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Kết quả - Ảnh</h1>
        <p className="text-[#666666] mt-1">
          Duyệt và quản lý ảnh đã xử lý
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

      {/* Image Manager with List/Grid view */}
      <ImageManager startDate={startDate} endDate={endDate} />
    </div>
  );
}
