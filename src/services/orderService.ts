import api from './api';
import { BackendOrder } from '@/types';

export interface PlaceOrderRequest {
  delivery_name: string;
  delivery_address: string;
  delivery_phone: string;
}

export interface PlaceOrderResponse {
  message: string;
  order: {
    id: number;
    status: string;
    total_amount: number;
  };
}

export const orderService = {
  /**
   * Place a new order
   */
  placeOrder: async (data: PlaceOrderRequest): Promise<PlaceOrderResponse> => {
    const response = await api.post<PlaceOrderResponse>('/orders', data);
    return response.data;
  },

  /**
   * Get all orders for the current user
   */
  getUserOrders: async (): Promise<BackendOrder[]> => {
    const response = await api.get<BackendOrder[]>('/orders');
    return response.data;
  },

  /**
   * Get a single order by ID
   */
  getOrder: async (orderId: number): Promise<BackendOrder> => {
    const response = await api.get<BackendOrder>(`/orders/${orderId}`);
    return response.data;
  },
};
