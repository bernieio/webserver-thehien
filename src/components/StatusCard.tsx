/**
 * StatusCard Component
 * Hiển thị trạng thái queue và thông tin hệ thống (không có connection error banner)
 */

import { useStatus } from '@/hooks/useStatus';

export default function StatusCard() {
  const { data, isLoading, isError } = useStatus();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-[#f5f5f5] rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-[#f5f5f5] rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return null; // Không hiển thị lỗi ở đây, đã chuyển sang tab Hệ thống
  }

  const queue = data?.queue || {};
  const system = data?.system || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Queue Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-[#666666] uppercase tracking-wider">
            Hàng đợi
          </h3>
          <span className={`badge text-lg ${queue.current_size && queue.current_size > 0 ? 'badge-info' : ''}`}>
            {queue.is_full ? 'Đầy' : queue.is_empty ? 'Trống' : 'Hoạt động'}
          </span>
        </div>
        <div className="text-5xl font-bold mb-1">
          {queue.current_size ?? 0}
        </div>
        <div className="text-lg text-[#666666]">
          / {queue.max_size ?? 100} dung lượng
        </div>
        <div className="mt-4 pt-4 border-t border-[#f0f0f0] grid grid-cols-2 gap-4 text-lg">
          <div>
            <div className="text-[#999999]">Đẩy vào</div>
            <div className="font-medium text-xl">{queue.total_pushed ?? 0}</div>
          </div>
          <div>
            <div className="text-[#999999]">Lấy ra</div>
            <div className="font-medium text-xl">{queue.total_popped ?? 0}</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <h3 className="text-lg font-medium text-[#666666] uppercase tracking-wider mb-2">
          Hệ thống
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="text-[#666666]">Bộ nhớ</span>
            <span className="font-medium text-xl">{system.memory_mb ?? 0} MB</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-[#666666]">CPU</span>
            <span className="font-medium text-xl">{system.cpu_percent ?? 0}%</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-[#666666]">Luồng</span>
            <span className="font-medium text-xl">{system.threads ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div className="card">
        <h3 className="text-lg font-medium text-[#666666] uppercase tracking-wider mb-2">
          Thời gian hoạt động
        </h3>
        <div className="text-5xl font-bold mb-1">
          {Math.floor((data?.uptime_seconds ?? 0) / 60)}
          <span className="text-2xl font-normal text-[#666666]"> phút</span>
        </div>
        <div className="text-lg text-[#999999]">
          Từ lần khởi động gần nhất
        </div>
      </div>
    </div>
  );
}
