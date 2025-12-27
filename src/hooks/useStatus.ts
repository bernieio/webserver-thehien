/**
 * Custom hooks for status data fetching using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { statusApi } from '@/lib/api';

export interface StatusData {
  status?: string;
  timestamp?: string;
  uptime_seconds?: number;
  queue?: {
    current_size?: number;
    max_size?: number;
    is_full?: boolean;
    is_empty?: boolean;
    total_pushed?: number;
    total_popped?: number;
  };
  system?: {
    memory_mb?: number;
    cpu_percent?: number;
    threads?: number;
  };
  last_image?: ImageData;
}

export interface ImageData {
  id: string;
  filename: string;
  url: string;
  width?: number;
  height?: number;
  size_bytes?: number;
  timestamp?: string;
  created_at?: string;
}

export interface HealthData {
  status: string;
}

/**
 * Hook for fetching server status with polling
 */
export function useStatus(options: { refetchInterval?: number } = {}) {
  return useQuery<StatusData>({
    queryKey: ['status'],
    queryFn: async () => {
      return await statusApi.getStatus();
    },
    refetchInterval: options.refetchInterval ?? 2000,
    staleTime: 1000,
  });
}

/**
 * Hook for fetching queue status only
 */
export function useQueueStatus(options: { refetchInterval?: number } = {}) {
  return useQuery({
    queryKey: ['queue-status'],
    queryFn: async () => {
      return await statusApi.getQueueStatus();
    },
    refetchInterval: options.refetchInterval ?? 2000,
    staleTime: 1000,
  });
}

/**
 * Hook for health check
 */
export function useHealthCheck(options: { refetchInterval?: number } = {}) {
  return useQuery<HealthData>({
    queryKey: ['health'],
    queryFn: async () => {
      return await statusApi.getHealth();
    },
    refetchInterval: options.refetchInterval ?? 5000,
    retry: 1,
  });
}
