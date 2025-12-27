/**
 * Statistics Hook
 * Custom hooks for fetching statistics data
 */

import { useQuery } from '@tanstack/react-query';

export interface StatisticsItem {
  stt: number;
  log_name: string;
  status: "GOOD" | "NG";
  error_detail: string;
  created_at: string;
}

export interface StatisticsResponse {
  items: StatisticsItem[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

interface StatisticsParams {
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

const API_BASE = '/api';

export function useStatistics(params: StatisticsParams, enabled = true) {
  return useQuery<StatisticsResponse>({
    queryKey: ['statistics', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, String(value));
        }
      });
      const response = await fetch(`${API_BASE}/statistics?${searchParams}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return response.json();
    },
    enabled,
  });
}

export function useAllStatistics(page = 1, pageSize = 100, enabled = true) {
  return useQuery<StatisticsResponse>({
    queryKey: ['statistics', 'all', page, pageSize],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/statistics/all?page=${page}&page_size=${pageSize}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return response.json();
    },
    enabled,
  });
}

export async function exportStatisticsCSV(startDate?: string, endDate?: string) {
  const searchParams = new URLSearchParams();
  if (startDate) searchParams.set('start_date', startDate);
  if (endDate) searchParams.set('end_date', endDate);
  
  const queryString = searchParams.toString();
  const url = `${API_BASE}/statistics/export-csv${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Export Error: ${response.status}`);
  }
  
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `statistics_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
}
