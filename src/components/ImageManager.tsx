/**
 * ImageManager Component
 * Quản lý ảnh với List/Grid view như Google Drive
 */

import { useState } from 'react';
import { useImages, useDeleteImages, ImageData } from '@/hooks/useImages';
import { formatFileSize, formatDateTime } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';

interface ImageManagerProps {
  startDate: string;
  endDate: string;
}

export default function ImageManager({ startDate, endDate }: ImageManagerProps) {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const pageSize = 50;

  const { data, isLoading, isError } = useImages({
    start_date: startDate,
    end_date: endDate,
    page,
    page_size: pageSize,
  });

  const deleteMutation = useDeleteImages();

  const images = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = data?.has_more ?? false;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map(img => img.id)));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Xóa ${selectedIds.size} ảnh đã chọn?`)) return;
    
    try {
      await deleteMutation.mutateAsync(Array.from(selectedIds));
      setSelectedIds(new Set());
      toast({ title: "Thành công", description: "Đã xóa ảnh" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể xóa ảnh", variant: "destructive" });
    }
  };

  const handleDownload = async (image: ImageData) => {
    try {
      const response = await fetch(`/api/images/${image.id}/download`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Lỗi", description: "Không thể tải ảnh", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="card animate-pulse"><div className="h-64 bg-[#f5f5f5] rounded" /></div>;
  }

  if (isError) {
    return <div className="card text-center py-8 text-[#ef4444]">Không thể tải ảnh</div>;
  }

  if (images.length === 0) {
    return <div className="card text-center py-12 text-[#999999]">Không có ảnh nào</div>;
  }

  return (
    <div>
      {/* Toolbar - View toggle first */}
      <div className="flex items-center justify-between mb-4 p-3 bg-[#fafafa] rounded-lg">
        {/* View Mode Toggle - Left side */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'hover:bg-[#e5e5e5]'}`} title="Dạng danh sách">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-white' : 'hover:bg-[#e5e5e5]'}`} title="Dạng lưới">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
          </div>
          <div className="w-px h-6 bg-[#e5e5e5]" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selectedIds.size === images.length} onChange={toggleSelectAll} className="w-4 h-4" />
            <span className="text-sm">Chọn tất cả</span>
          </label>
          <span className="text-sm text-[#666666]">{total} ảnh</span>
        </div>
        {/* Selection actions - Right side */}
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <>
              <span className="text-sm text-[#3b82f6]">{selectedIds.size} đã chọn</span>
              <button onClick={handleDelete} className="btn btn-danger text-xs px-3 py-1">Xóa</button>
            </>
          )}
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <table className="table w-full">
          <thead>
            <tr><th className="w-10"></th><th>STT</th><th>Tên ảnh</th><th>Ngày tải lên</th><th>Kích cỡ</th><th></th></tr>
          </thead>
          <tbody>
            {images.map((img, i) => (
              <tr key={img.id} className="hover:bg-[#fafafa]">
                <td><input type="checkbox" checked={selectedIds.has(img.id)} onChange={() => toggleSelect(img.id)} /></td>
                <td>{(page - 1) * pageSize + i + 1}</td>
                <td className="flex items-center gap-2">
                  <img src={img.url} alt="" className="w-8 h-8 object-cover rounded" />
                  <span className="truncate max-w-[200px]">{img.filename}</span>
                </td>
                <td className="text-sm text-[#666666]">{formatDateTime(img.created_at)}</td>
                <td className="text-sm">{formatFileSize(img.size_bytes)}</td>
                <td><button onClick={() => handleDownload(img)} className="text-[#3b82f6] text-sm hover:underline">Tải</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {images.map((img) => (
            <div key={img.id} className={`relative group rounded-lg overflow-hidden border-2 ${selectedIds.has(img.id) ? 'border-[#1a1a1a]' : 'border-transparent hover:border-[#e5e5e5]'}`}>
              <div className="aspect-square bg-[#fafafa]" onClick={() => toggleSelect(img.id)}>
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white text-xs">
                <div className="truncate font-medium">{img.filename}</div>
                <div>{formatDateTime(img.created_at)}</div>
                <div>{formatFileSize(img.size_bytes)}</div>
                <button onClick={() => handleDownload(img)} className="mt-1 underline">Tải xuống</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4 pt-4 border-t border-[#f0f0f0]">
        <span className="text-sm text-[#666666]">Trang {page}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary">Trước</button>
          <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="btn btn-secondary">Sau</button>
        </div>
      </div>
    </div>
  );
}
