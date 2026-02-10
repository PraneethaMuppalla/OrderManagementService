import api from './api';
import { CartResponse, AddToCartResponse, UpdateCartItemResponse } from '@/types';

export interface AddToCartRequest {
  menuItemId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * Cart API service
 */
export const cartService = {
  /**
   * Get user's cart
   */
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get<CartResponse>('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  addToCart: async (data: AddToCartRequest): Promise<AddToCartResponse> => {
    const response = await api.post<AddToCartResponse>('/cart/items', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<UpdateCartItemResponse> => {
    const response = await api.put<UpdateCartItemResponse>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/cart/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/cart/clear');
    return response.data;
  },
};
