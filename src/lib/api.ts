/**
 * API Client Configuration
 * Centralized API client using fetch with base URL.
 */

const API_BASE = '/api';

async function fetchApi(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// API functions
export const statusApi = {
  getStatus: () => fetchApi('/status'),
  getHealth: () => fetchApi('/status/health'),
  getQueueStatus: () => fetchApi('/status/queue'),
};

export const imagesApi = {
  popFromQueue: () => fetchApi('/images/from-queue'),
  listImages: (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return fetchApi(`/images?${searchParams.toString()}`);
  },
  getImage: (id: string) => fetchApi(`/images/${id}`),
  getImageUrl: (id: string, expiration = 3600) => fetchApi(`/images/${id}/url?expiration=${expiration}`),
  deleteImage: (id: string) => fetchApi(`/images/${id}`, { method: 'DELETE' }),
  deleteImages: (ids: string[]) => fetchApi('/images/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  }),
};

export const logsApi = {
  getLatestLogs: () => fetchApi('/logs/latest'),
  getActivityLogs: () => fetchApi('/logs/activity'),
  getServerLogs: () => fetchApi('/logs/server'),
  listLogs: (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return fetchApi(`/logs?${searchParams.toString()}`);
  },
  cleanupLogs: (days = 90) => fetchApi(`/logs/cleanup?days=${days}`, { method: 'DELETE' }),
  clearHotLogs: (logType?: string) => fetchApi(`/logs/clear-hot${logType ? `?log_type=${logType}` : ''}`, { method: 'POST' }),
};

export default { statusApi, imagesApi, logsApi };
