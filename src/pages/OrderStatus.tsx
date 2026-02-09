import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { updateOrderStatus } from '@/store/orderSlice';
import { Order } from '@/types';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2, Package, Truck } from 'lucide-react';

const statuses: Order['status'][] = [
    'Order Received',
    'Preparing',
    'Out for Delivery',
    'Delivered'
];

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => 
    state.order.orders.find((o) => o.id === orderId)
  );

  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const timer = setTimeout(() => {
        let nextStatus: Order['status'] | null = null;
        switch (order.status) {
            case 'Order Received':
                nextStatus = 'Preparing';
                break;
            case 'Preparing':
                nextStatus = 'Out for Delivery';
                break;
            case 'Out for Delivery':
                nextStatus = 'Delivered';
                break;
        }

        if (nextStatus) {
            dispatch(updateOrderStatus({ orderId: orderId!, status: nextStatus }));
        }
    }, 3000); // Update every 3 seconds for demo purposes

    return () => clearTimeout(timer);
  }, [order, orderId, dispatch]);

  if (!order) {
    return (
        <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find the order holding that ID.</p>
            <Button asChild>
                <Link to="/menu">Browse Menu</Link>
            </Button>
        </div>
    );
  }

  const currentStatusIndex = statuses.indexOf(order.status);
  const getStatusIcon = (status: Order['status']) => {
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
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Order Status</h1>
            <p className="text-muted-foreground">Order ID: <span className="font-mono text-sm">{order.id}</span></p>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-4 after:absolute after:left-7 md:after:left-0 md:after:top-5 md:after:w-full md:after:h-[2px] after:h-full after:w-[2px] after:bg-muted after:-z-10">
            {statuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                    <div key={status} className={`flex md:flex-col items-center gap-4 md:gap-2 z-10 bg-background md:px-2 py-2 w-full md:w-auto ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ${
                            isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background'
                        } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                            {index < currentStatusIndex ? <CheckCircle2 className="h-5 w-5" /> : (isCurrent ? getStatusIcon(status) : <Circle className="h-5 w-5" />)}
                        </div>
                        <span className={`text-sm font-medium ${isCurrent ? 'font-bold text-foreground' : ''}`}>{status}</span>
                    </div>
                )
            })}
        </div>

        <div className="bg-muted/30 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-lg mb-4">Delivery To</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Name</p>
                    <p>{order.deliveryDetails.name}</p>
                </div>
                <div className="space-y-1">
                     <p className="font-medium text-muted-foreground">Phone</p>
                    <p>{order.deliveryDetails.phoneNumber}</p>
                </div>
                 <div className="col-span-1 md:col-span-2 space-y-1">
                     <p className="font-medium text-muted-foreground">Address</p>
                    <p>{order.deliveryDetails.address}</p>
                </div>
            </div>
        </div>

        <div className="flex justify-center pt-4">
             {order.status === 'Delivered' ? (
                 <div className="text-center space-y-4">
                     <p className="text-green-600 font-medium flex items-center gap-2 text-lg"><CheckCircle2 className="h-6 w-6" /> Order Delivered Successfully!</p>
                     <Button asChild size="lg">
                        <Link to="/menu">Order Again</Link>
                    </Button>
                 </div>
             ) : (
                <p className="text-sm text-muted-foreground animate-pulse">
                    Estimating delivery time...
                </p>
             )}
        </div>
      </div>
    </div>
  );
}
