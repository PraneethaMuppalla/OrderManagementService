import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, AddToCartRequest, UpdateCartItemRequest } from '@/services/cartService';
import { toast } from 'sonner';
import { useAppSelector } from '@/hooks/redux';

/**
 * Hook for fetching user's cart
 */
export const useCart = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 30 * 1000, // 30 seconds - cart changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: isAuthenticated,
  });
};

/**
 * Hook for adding items to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: (response) => {
      // Refetch cart to get updated data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response.message || 'Item added to cart');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for updating cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: UpdateCartItemRequest }) =>
      cartService.updateCartItem(itemId, data),
    onSuccess: (response) => {
      // Refetch cart to get updated data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response.message || 'Cart updated');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update cart';
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for removing items from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
    onSuccess: (response) => {
      // Refetch cart to get updated data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response.message || 'Item removed from cart');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to remove item';
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for clearing the entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (response) => {
      // Refetch cart to get updated data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response.message || 'Cart cleared');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      toast.error(errorMessage);
    },
  });
};
