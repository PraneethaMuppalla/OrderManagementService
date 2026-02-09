import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    placeOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
      state.currentOrder = action.payload;
    },
    updateOrderStatus(state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        if (state.currentOrder && state.currentOrder.id === action.payload.orderId) {
            state.currentOrder.status = action.payload.status;
        }
      }
    },
    setCurrentOrder(state, action: PayloadAction<string>) {
        const order = state.orders.find(o=>o.id === action.payload);
        state.currentOrder = order || null;
    }
  },
});

export const { placeOrder, updateOrderStatus, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
