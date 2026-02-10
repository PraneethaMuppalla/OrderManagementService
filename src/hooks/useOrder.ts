import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService, PlaceOrderRequest } from '@/services/orderService';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { initSocket, disconnectSocket } from '@/services/socket';

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PlaceOrderRequest) => orderService.placeOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] }); // Cart is cleared on backend
            // Success toast is handled in component or here if needed
            // toast.success(data.message || 'Order placed successfully'); 
        },
        onError: (error: any) => {
             const message = error.response?.data?.message || 'Failed to place order';
             toast.error(message);
        }
    });
};

export const useUserOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => orderService.getUserOrders(),
        staleTime: 60 * 1000 // 1 min
    });
};

export const useOrder = (orderId: number) => {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrder(orderId),
        enabled: !!orderId,
        retry: 1,
        refetchInterval: 5000,
    });
};

// Hook to initialize socket for order status updates
export const useOrderSocket = () => {
    const { user } = useAppSelector((state) => state.auth);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user?.id) {
           // Provide userId to identify socket connection
           const socket = initSocket(user.id);

           const handleStatusUpdate = (data: any) => {
               console.log('🔄 Socket update hook received:', data);
               // Invalidate orders lists
               queryClient.invalidateQueries({ queryKey: ['orders'] }); 
               // Invalidate specific order details if cached
               if (data.orderId) {
                   const id = data.orderId;
                   console.log(`Invalidating query keys for order ${id} (type: ${typeof id})`);
                   // Invalidate both string and number versions to be safe
                   queryClient.invalidateQueries({ queryKey: ['order', Number(id)] });
                   queryClient.invalidateQueries({ queryKey: ['order', String(id)] });
               }
           };

           socket.on('order_status_update', handleStatusUpdate);

           return () => {
               socket.off('order_status_update', handleStatusUpdate);
               // Optional: disconnect socket when user logs out or app unmounts
               // disconnectSocket(); 
           };
        } else {
            // If no user, ensure socket is disconnected
            disconnectSocket();
        }
    }, [user?.id, queryClient]);
};
