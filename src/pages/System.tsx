/**
 * Tab Hệ thống - System Page
 * Hiển thị thông tin hệ thống, trạng thái kết nối, bảo trì
 */

import { useStatus, useHealthCheck } from '@/hooks/useStatus';
import { useCleanupLogs, useClearHotLogs } from '@/hooks/useLogs';
import { formatDateTime } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';
import StatusCard from '@/components/StatusCard';

export default function System() {
  const { data: status } = useStatus();
  const { data: health, isError } = useHealthCheck();
  const cleanupMutation = useCleanupLogs();
  const clearHotMutation = useClearHotLogs();

  const isConnected = health?.status === 'ok';

  const handleCleanup = async () => {
    if (window.confirm('Xóa nhật ký cũ hơn 90 ngày?')) {
      try {
        await cleanupMutation.mutateAsync(90);
        toast({
          title: "Thành công",
          description: `Đã dọn dẹp ${cleanupMutation.data?.deleted_count ?? 0} nhật ký cũ`,
        });
      } catch {
        toast({
          title: "Lỗi",
          description: "Không thể dọn dẹp nhật ký",
          variant: "destructive",
        });
      }
    }
  };

  const handleClearHot = async (type: string) => {
    if (window.confirm(`Xóa nhật ký ${type || 'tất cả'} đang hoạt động?`)) {
      try {
        await clearHotMutation.mutateAsync(type);
        toast({
          title: "Thành công",
          description: "Đã xóa nhật ký",
        });
      } catch {
        toast({
          title: "Lỗi",
          description: "Không thể xóa nhật ký",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Hệ thống</h1>
        <p className="text-[#666666] mt-1">
          Cấu hình hệ thống và công cụ bảo trì
        </p>
      </div>

      {/* Status Cards - Moved from Dashboard */}
      <StatusCard />

      {/* Connection Status */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Trạng thái kết nối</h2>
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-[#22c55e]' : isError ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'
            }`}
          />
          <span className="text-sm font-medium">
            {isConnected ? 'Đã kết nối' : isError ? 'Mất kết nối' : 'Đang kết nối...'}
          </span>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Server Info */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Thông tin máy chủ</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">Trạng thái</span>
              <span className="font-medium flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                {status?.status ?? 'Không xác định'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">Thời gian hoạt động</span>
              <span className="font-medium">
                {Math.floor((status?.uptime_seconds ?? 0) / 60)} phút
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">Bộ nhớ sử dụng</span>
              <span className="font-medium">{status?.system?.memory_mb ?? 0} MB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">CPU sử dụng</span>
              <span className="font-medium">{status?.system?.cpu_percent ?? 0}%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#666666]">Số luồng</span>
              <span className="font-medium">{status?.system?.threads ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Queue Info */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Cấu hình hàng đợi</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">Kích thước tối đa</span>
              <span className="font-medium">{status?.queue?.max_size ?? 100}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">Kích thước hiện tại</span>
              <span className="font-medium">{status?.queue?.current_size ?? 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
              <span className="text-[#666666]">Tổng số đẩy vào</span>
              <span className="font-medium">{status?.queue?.total_pushed ?? 0}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#666666]">Tổng số lấy ra</span>
              <span className="font-medium">{status?.queue?.total_popped ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Bảo trì</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#fafafa] rounded-lg">
            <h3 className="font-medium mb-2">Dọn dẹp nhật ký cũ</h3>
            <p className="text-sm text-[#666666] mb-3">
              Xóa nhật ký cũ hơn 90 ngày khỏi cơ sở dữ liệu.
            </p>
            <button
              onClick={handleCleanup}
              disabled={cleanupMutation.isPending}
              className="btn btn-secondary w-full"
            >
              {cleanupMutation.isPending ? 'Đang dọn...' : 'Dọn dẹp'}
            </button>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-lg">
            <h3 className="font-medium mb-2">Xóa nhật ký hoạt động</h3>
            <p className="text-sm text-[#666666] mb-3">
              Xóa bộ đệm nhật ký hoạt động thời gian thực.
            </p>
            <button
              onClick={() => handleClearHot('activity')}
              disabled={clearHotMutation.isPending}
              className="btn btn-secondary w-full"
            >
              Xóa hoạt động
            </button>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-lg">
            <h3 className="font-medium mb-2">Xóa nhật ký máy chủ</h3>
            <p className="text-sm text-[#666666] mb-3">
              Xóa bộ đệm nhật ký máy chủ thời gian thực.
            </p>
            <button
              onClick={() => handleClearHot('server')}
              disabled={clearHotMutation.isPending}
              className="btn btn-secondary w-full"
            >
              Xóa máy chủ
            </button>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Môi trường</h2>
        <div className="bg-[#fafafa] rounded-lg p-4 font-mono text-sm">
          <div className="text-[#999999]">Địa chỉ API</div>
          <div className="mb-3">http://127.0.0.1:8000</div>

          <div className="text-[#999999]">Lưu trữ</div>
          <div className="mb-3">Cloudflare R2 / KV / D1</div>

          <div className="text-[#999999]">Cập nhật lần cuối</div>
          <div>{formatDateTime(status?.timestamp)}</div>
        </div>
      </div>
    </div>
  );
}
