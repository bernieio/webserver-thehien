/**
 * Custom hooks for images data fetching using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imagesApi } from '@/lib/api';

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

export interface ImagesResponse {
  items: ImageData[];
  total: number;
  has_more: boolean;
}

/**
 * Hook for fetching images with filters
 */
export function useImages(params: {
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery<ImagesResponse>({
    queryKey: ['images', params],
    queryFn: async () => {
      return await imagesApi.listImages(params);
    },
  });
}

/**
 * Hook for popping image from queue
 */
export function usePopFromQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await imagesApi.popFromQueue();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

/**
 * Hook for deleting an image
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await imagesApi.deleteImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

/**
 * Hook for deleting multiple images
 */
export function useDeleteImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete images one by one if bulk delete not supported
      await Promise.all(ids.map(id => imagesApi.deleteImage(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}
