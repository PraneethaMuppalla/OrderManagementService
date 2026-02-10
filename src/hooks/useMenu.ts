import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Product, CategoriesResponse } from '@/types';

interface MenuParams {
  category?: string;
  search?: string;
  limit?: number;
}

interface MenuResponse {
  items: Product[];
  pagination: {
    nextCursor: number | null;
    hasMore: boolean;
    limit: number;
    total: number;
  };
}

/**
 * Hook for fetching menu items with infinite scroll pagination
 * Uses cursor-based pagination for better performance
 */
export const useInfiniteMenu = ({ category, search, limit = 8 }: MenuParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['menu', { category, search }],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      if (search) {
        params.append('search', search);
      }
      
      params.append('cursor', pageParam.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get<MenuResponse>(`/menu?${params.toString()}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      // Return the next cursor if there are more items, otherwise undefined
      return lastPage.pagination.hasMore ? lastPage.pagination.nextCursor : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching all menu categories with statistics
 */
export const useMenuCategories = () => {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const response = await api.get<CategoriesResponse>('/menu/categories');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // Categories change less frequently - 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });
};
