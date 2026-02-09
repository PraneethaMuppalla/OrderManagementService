import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearCart } from '@/store/cartSlice';
import { placeOrder } from '@/store/orderSlice';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      address: '',
      phoneNumber: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: CheckoutFormValues) => {
    // Simulate API call
    console.log('Checkout Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create new order
    const orderId = uuidv4();
    const newOrder = {
      id: orderId,
      items: [...items],
      totalAmount,
      status: 'Order Received' as const,
      deliveryDetails: {
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
      },
      createdAt: new Date().toISOString(),
    };

    // Dispatch actions
    dispatch(placeOrder(newOrder));
    dispatch(clearCart());
    
    toast.success('Order placed successfully!');
    
    // Redirect to Order Status page
    navigate(`/order-status/${orderId}`);
  };

  if (items.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
              <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-muted/30 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0 border-border/50">
                        <div className="flex items-center gap-3">
                            <span className="font-medium bg-background text-foreground h-6 w-6 flex items-center justify-center rounded-full text-xs shadow-sm shadow-black/5 border border-border">{item.quantity}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
            </div>
        </div>

        {/* Shipping Details Form */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                        <Textarea 
                            placeholder="Please include street, city, and zip code" 
                            className="resize-none min-h-[100px]" 
                            {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={isSubmitting}
                >
                {isSubmitting ? "Placing Order..." : `Pay ₹${totalAmount.toFixed(2)}`}
                </Button>
            </form>
            </Form>
        </div>
      </div>
    </div>
  );
}
