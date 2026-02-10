import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrder';
import { getSocket } from '@/services/socket';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2, Package, Truck, Clock } from 'lucide-react';

const statuses = [
    'Order Received',
    'Preparing',
    'Out for Delivery',
    'Delivered'
];

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, refetch } = useOrder(parseInt(orderId || '0'));
  const [lastUpdate, setLastUpdate] = useState<{status: string, message?: string} | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
        const handler = (data: any) => {
            // Check if update is for this order
            if (String(data.orderId) === String(orderId)) {
                console.log("⚡ Order update received via socket, refreshing data...");
                setLastUpdate({ status: data.status, message: data.message });
                refetch();
            }
        };
        socket.on('order_status_update', handler);
        return () => { socket.off('order_status_update', handler); };
    }
  }, [orderId, refetch]);

  if (isLoading) {
       return (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p className="text-muted-foreground">Loading order details...</p>
          </div>
       )
  }

  if (!order) {
    return (
        <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find the order with ID #{orderId}.</p>
            <Button asChild>
                <Link to="/menu">Browse Menu</Link>
            </Button>
        </div>
    );
  }

  // Normalize status for comparison if needed, or use specific strings from backend
  const currentStatusIndex = statuses.indexOf(order.status) !== -1 ? statuses.indexOf(order.status) : 0;
  
  const getStatusIcon = (status: string) => {
      switch (status) {
          case 'Order Received': return <CheckCircle2 className="h-5 w-5" />;
          case 'Preparing': return <Loader2 className="h-5 w-5 animate-spin" />;
          case 'Out for Delivery': return <Truck className="h-5 w-5" />;
          case 'Delivered': return <Package className="h-5 w-5" />;
          default: return <Circle className="h-5 w-5" />;
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-background border rounded-xl shadow-sm p-6 md:p-10 space-y-8">
        <div className="text-center space-y-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Order Status</h1>
                <p className="text-muted-foreground">Order ID: <span className="font-mono text-sm">{order.id}</span></p>
            </div>
            
            {lastUpdate && (
                <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg animate-in fade-in slide-in-from-top-2 mx-auto max-w-md">
                    <p className="font-medium text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {lastUpdate.message || `Order status updated to ${lastUpdate.status}`}
                    </p>
                </div>
            )}

            <p className="text-sm text-muted-foreground flex justify-center items-center gap-2">
                <Clock className="h-4 w-4" /> 
                {new Date(order.createdAt).toLocaleString()}
            </p>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-4 md:py-8">
            {/* Connecting Line */}
            <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-muted -z-10 md:left-0 md:right-0 md:top-1/2 md:h-[2px] md:w-full md:bottom-auto md:-translate-y-1/2" />
            
            {statuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                    <div key={status} className={`flex md:flex-col items-center gap-4 md:gap-3 z-10 bg-background py-2 w-full md:w-auto md:justify-center ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`flex items-center justify-center h-10 w-10 shrink-0 rounded-full border-2 transition-all duration-500 ${
                            isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background'
                        } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                            {index < currentStatusIndex ? <CheckCircle2 className="h-5 w-5" /> : (isCurrent ? getStatusIcon(status) : <Circle className="h-5 w-5" />)}
                        </div>
                        <span className={`text-sm font-medium ${isCurrent ? 'font-bold text-foreground' : ''}`}>{status}</span>
                    </div>
                )
            })}
        </div>

        <div className="bg-muted/30 rounded-lg p-6 mt-8 space-y-6">
            <div>
                 <h3 className="font-semibold text-lg mb-4">Delivery Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Name</p>
                        <p>{order.delivery_name}</p>
                    </div>
                    <div className="space-y-1">
                         <p className="font-medium text-muted-foreground">Phone</p>
                        <p>{order.delivery_phone}</p>
                    </div>
                     <div className="col-span-1 md:col-span-2 space-y-1">
                         <p className="font-medium text-muted-foreground">Address</p>
                        <p className="whitespace-pre-wrap">{order.delivery_address}</p>
                    </div>
                </div>
            </div>
            
            <div className="border-t pt-4">
                 <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                 <div className="space-y-3">
                     {/* We assume items might be populated, if using 'include' in backend */}
                     {order.items && order.items.length > 0 ? (
                         order.items.map((item: any) => (
                             <div key={item.id} className="flex justify-between items-center text-sm">
                                 <div className="flex items-center gap-2">
                                     <span className="font-medium bg-secondary h-6 w-6 flex items-center justify-center rounded-full text-xs">{item.quantity}</span>
                                     <span>{item.menuItem?.name || `Item #${item.menuItemId}`}</span>
                                 </div>
                                 <span className="font-semibold">₹{(parseFloat(item.price_at_order) * item.quantity).toFixed(2)}</span>
                             </div>
                         ))
                     ) : (
                         <p className="text-sm text-muted-foreground">Items details not available.</p>
                     )}
                     <div className="border-t pt-2 flex justify-between font-bold text-lg mt-2">
                         <span>Total</span>
                         <span>₹{order.total_amount}</span>
                     </div>
                 </div>
            </div>
        </div>

        <div className="flex justify-center pt-4">
             {order.status === 'Delivered' ? (
                 <div className="text-center space-y-4">
                     <p className="text-green-600 font-medium flex items-center gap-2 text-lg justify-center"><CheckCircle2 className="h-6 w-6" /> Order Delivered Successfully!</p>
                     <Button asChild size="lg">
                        <Link to="/menu">Order Again</Link>
                    </Button>
                 </div>
             ) : (
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Your order is being processed...
                    </p>
                </div>
             )}
        </div>
      </div>
    </div>
  );
}
