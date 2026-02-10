import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

let socket: Socket | null = null;
// Need to ensure the backend supports CORS for this origin
const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // In optimal setup, use env variable

interface OrderStatusUpdate {
  orderId: number;
  status: string;
  message?: string;
}

export const initSocket = (userId: string | number) => {
  if (socket) return socket;

  // Ensure userId is string
  const idStr = String(userId);
  console.log(`🔌 Initializing socket for user: ${idStr}`);

  // Passing userId in query for simple identification
  // Ideally, send token in auth header: { auth: { token } }
  socket = io(URL, {
    query: { userId: idStr },
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server', socket?.id);
    toast.success('Connected to real-time updates');
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
    // Don't toast error continuously on reconnect attempts, maybe once
  });

  socket.on('disconnect', (reason) => {
    console.log('⚠️ Disconnected from socket server:', reason);
  });

  // Listen for order updates
  socket.on('order_status_update', (data: OrderStatusUpdate) => {
    console.log('Order status update received:', data);
    toast.success(`Order #${data.orderId}`, {
      description: data.message || `Status updated to: ${data.status}`,
      duration: 5000,
    });
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
