/**
 * Tab Vận hành - Dashboard Page
 * Hiển thị queue, ảnh đang xử lý, logs realtime
 */

import ImagePreview from '@/components/ImagePreview';
import LogPanel from '@/components/LogPanel';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Vận hành</h1>
        <p className="text-[#666666] mt-1">
          Giám sát hàng đợi xử lý ảnh theo thời gian thực
        </p>
      </div>

      {/* Image Preview */}
      <ImagePreview />

      {/* Log Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogPanel type="activity" title="Nhật ký hoạt động" maxHeight="350px" />
        <LogPanel type="server" title="Nhật ký máy chủ" maxHeight="350px" />
      </div>
    </div>
  );
}
