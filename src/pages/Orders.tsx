import { useUserOrders } from '@/hooks/useOrder';
import { Loader2, Package, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function Orders() {
  const { data: orders, isLoading } = useUserOrders();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">Start your culinary journey with us today!</p>
        <Button asChild>
          <Link to="/menu">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-lg">Order #{order.id}</span>
                          <Badge variant={order.status === 'Delivered' ? 'secondary' : 'default'} className={
                              order.status === 'Order Received' ? 'bg-blue-500 hover:bg-blue-600' :
                              order.status === 'Preparing' ? 'bg-amber-500 hover:bg-amber-600' :
                              order.status === 'Out for Delivery' ? 'bg-purple-500 hover:bg-purple-600' :
                              'bg-green-600 hover:bg-green-700'
                          }>{order.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  </div>
                  <div className="text-left md:text-right">
                       <p className="font-bold text-lg">₹{order.total_amount}</p>
                       <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                  </div>
              </div>
              
              <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <p className="text-sm text-muted-foreground line-clamp-1 max-w-full sm:max-w-[70%]">
                       {/* Show names of items */}
                       {order.items?.map(item => item.menuItem?.name || `Item #${item.menuItemId}`).join(', ')}
                   </p>
                   <Button variant="outline" size="sm" asChild className="shrink-0 w-full sm:w-auto">
                       <Link to={`/order-status/${order.id}`}>
                           View Details <ChevronRight className="ml-1 h-3 w-3" />
                       </Link>
                   </Button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
