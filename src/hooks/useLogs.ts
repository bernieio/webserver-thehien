/**
 * Custom hooks for logs data fetching using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logsApi } from '@/lib/api';

export interface LogEntry {
  id?: string;
  timestamp?: string;
  created_at?: string;
  type?: string;
  level?: string;
  message?: string;
  action?: string;
  source?: string;
}

export interface LogsResponse {
  items: LogEntry[];
  total: number;
  has_more: boolean;
}

/**
 * Hook for fetching latest logs
 */
export function useLatestLogs() {
  return useQuery({
    queryKey: ['logs', 'latest'],
    queryFn: async () => {
      return await logsApi.getLatestLogs();
    },
    refetchInterval: 2000,
  });
}

/**
 * Hook for fetching activity logs
 */
export function useActivityLogs() {
  return useQuery<LogEntry[]>({
    queryKey: ['logs', 'activity'],
    queryFn: async () => {
      return await logsApi.getActivityLogs();
    },
    refetchInterval: 2000,
  });
}

/**
 * Hook for fetching server logs
 */
export function useServerLogs() {
  return useQuery<LogEntry[]>({
    queryKey: ['logs', 'server'],
    queryFn: async () => {
      return await logsApi.getServerLogs();
    },
    refetchInterval: 2000,
  });
}

/**
 * Hook for fetching logs with filters
 */
export function useLogs(params: {
  start_date?: string;
  end_date?: string;
  log_type?: string;
  level?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery<LogsResponse>({
    queryKey: ['logs', params],
    queryFn: async () => {
      return await logsApi.listLogs(params);
    },
  });
}

/**
 * Hook for cleaning up old logs
 */
export function useCleanupLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: number) => {
      return await logsApi.cleanupLogs(days);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

/**
 * Hook for clearing hot logs
 */
export function useClearHotLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logType?: string) => {
      return await logsApi.clearHotLogs(logType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', 'activity'] });
      queryClient.invalidateQueries({ queryKey: ['logs', 'server'] });
    },
  });
}
