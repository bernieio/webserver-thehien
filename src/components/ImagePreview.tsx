/**
 * ImagePreview Component
 * Auto-process queue và hiển thị ảnh với timestamp khi push thành công
 */

import { useState, useEffect, useRef } from 'react';
import { usePopFromQueue, ImageData } from '@/hooks/useImages';
import { useStatus } from '@/hooks/useStatus';
import { formatFileSize, formatDimensions, formatRelativeTime, formatDateTime } from '@/utils/formatters';

export default function ImagePreview() {
  const { data: status } = useStatus({ refetchInterval: 500 });
  const popMutation = usePopFromQueue();

  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [imageHistory, setImageHistory] = useState<ImageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const queueSize = status?.queue?.current_size ?? 0;

  // Auto-pop from queue when items are available
  useEffect(() => {
    const processQueue = async () => {
      if (queueSize > 0 && !isProcessing && !popMutation.isPending) {
        setIsProcessing(true);
        try {
          const result = await popMutation.mutateAsync();
          if (result.success && result.image) {
            // Update current image
            setCurrentImage(result.image);

            // Add to history (newest first)
            setImageHistory(prev => {
              const newHistory = [result.image, ...prev];
              // Keep max 50 items in history
              return newHistory.slice(0, 50);
            });
          }
        } catch (error) {
          console.error('Auto-pop failed:', error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    processQueue();
  }, [queueSize, isProcessing, popMutation.isPending]);

  // Auto-scroll history to top when new image added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = 0;
    }
  }, [imageHistory.length]);

  const displayImage = currentImage || status?.last_image;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider">
          Hàng đợi tự động xử lý
        </h3>
        <div className="flex items-center gap-3">
          {/* Processing indicator */}
          {(isProcessing || popMutation.isPending) && (
            <div className="flex items-center gap-2 text-sm text-[#3b82f6]">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang xử lý...
            </div>
          )}

          {/* Queue size badge */}
          <span className={`badge ${queueSize > 0 ? 'badge-info' : ''}`}>
            Hàng đợi: {queueSize}
          </span>

          {/* History count */}
          <span className="badge">
            Lịch sử: {imageHistory.length}
          </span>
        </div>
      </div>

      {/* Main content with image preview and history scroller */}
      <div className="flex gap-4">
        {/* Main image display */}
        <div className="flex-1">
          {displayImage ? (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video bg-[#fafafa] rounded-lg overflow-hidden">
                <img
                  src={displayImage.url}
                  alt={displayImage.filename}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
                  }}
                />

                {/* Live indicator */}
                {(isProcessing || popMutation.isPending) && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                    TRỰC TIẾP
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-[#999999]">Tên file</div>
                  <div className="font-medium truncate" title={displayImage.filename}>
                    {displayImage.filename}
                  </div>
                </div>
                <div>
                  <div className="text-[#999999]">Kích thước</div>
                  <div className="font-medium">
                    {formatDimensions(displayImage.width, displayImage.height) || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[#999999]">Dung lượng</div>
                  <div className="font-medium">
                    {formatFileSize(displayImage.size_bytes) || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[#999999]">Đã xử lý</div>
                  <div className="font-medium">
                    {formatRelativeTime(displayImage.timestamp || displayImage.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state py-12">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">Đang chờ ảnh...</p>
              <p className="text-sm">
                Tải ảnh từ giao diện desktop để tự động xử lý.
              </p>
            </div>
          )}
        </div>

        {/* Image History Scroller with Timestamp (Right side) */}
        <div className="w-56 flex-shrink-0">
          <div className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2">
            Ảnh gần đây
          </div>
          <div
            ref={historyRef}
            className="overflow-y-auto bg-[#fafafa] rounded-lg"
            style={{ height: '400px' }}
          >
            {imageHistory.length > 0 ? (
              <div className="p-2 space-y-2">
                {imageHistory.map((img, index) => (
                  <div
                    key={img.id || index}
                    className={`cursor-pointer rounded overflow-hidden border-2 transition-all ${
                      currentImage?.id === img.id
                        ? 'border-[#1a1a1a]'
                        : 'border-transparent hover:border-[#e5e5e5]'
                    }`}
                    onClick={() => setCurrentImage(img)}
                  >
                    <div className="flex gap-2">
                      {/* Thumbnail */}
                      <div className="w-16 h-12 bg-[#f5f5f5] flex-shrink-0 relative">
                        <img
                          src={img.url}
                          alt={img.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-0 left-0 bg-[#22c55e] text-white text-[8px] px-1">
                            MỚI
                          </div>
                        )}
                      </div>
                      {/* Info with timestamp */}
                      <div className="flex-1 py-1 pr-1 min-w-0">
                        <div className="text-[10px] font-medium truncate">
                          {img.filename}
                        </div>
                        <div className="text-[9px] text-[#999999]">
                          {formatDimensions(img.width, img.height)}
                        </div>
                        <div className="text-[9px] text-[#3b82f6]">
                          {formatDateTime(img.timestamp || img.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#999999] text-sm">
                Chưa có ảnh
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
