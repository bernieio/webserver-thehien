/**
 * Date and formatting utilities
 */

/**
 * Format a date as a relative time string (e.g., "2 giờ trước")
 */
export function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return 'Chưa có';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString('vi-VN');
}

/**
 * Format a date as ISO date string (YYYY-MM-DD)
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
}

/**
 * Format a date as full datetime string
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN');
}

/**
 * Format a timestamp for logs (HH:MM:SS.mmm)
 */
export function formatLogTime(dateString: string | undefined | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toTimeString().slice(0, 12);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number | undefined | null): string {
  if (bytes === 0) return '0 B';
  if (!bytes) return '';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format dimensions string
 */
export function formatDimensions(width: number | undefined | null, height: number | undefined | null): string {
  if (!width || !height) return '';
  return `${width}×${height}`;
}

/**
 * Get today's date as ISO string
 */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get date N days ago as ISO string
 */
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
