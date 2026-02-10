import { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, Loader2, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart from API
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeFromCart } = useRemoveFromCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cart = cartData?.cart;
  const items = cart?.items || [];
  const totalItems = cart?.itemCount || 0;
  const totalPrice = cart?.subtotal || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-shadow ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            FoodOrder
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs p-0"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-6">
              <SheetHeader className="px-1">
                <SheetTitle>Your Cart ({totalItems})</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 my-4 pr-4">
                {cartLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Loader2 className="h-8 w-8 mb-4 animate-spin" />
                    <p>Loading cart...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex space-x-4 border-b pb-4 last:border-0">
                        <div className="h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                            <img src={item.menuItem.image_url} alt={item.menuItem.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm line-clamp-1">{item.menuItem.name}</h4>
                            <p className="text-sm font-medium text-muted-foreground">
                              ₹{item.menuItem.price}
                            </p>
                            {item.availability_warning && (
                                <p className="text-xs text-amber-600 font-medium">{item.availability_warning}</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                             <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateCartItem({ itemId: item.id, data: { quantity: item.quantity - 1 } })}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </Button>
                                <span className="text-sm w-4 text-center tabular-nums">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateCartItem({ itemId: item.id, data: { quantity: item.quantity + 1 } })}
                                >
                                  +
                                </Button>
                             </div>
                             <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                            >
                                Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {items.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{totalPrice}</span>
                      </div>
                      <SheetFooter>
                          <Button className="w-full" size="lg" onClick={() => {
                              setIsCartOpen(false);
                              navigate('/checkout');
                          }}>
                              Proceed to Checkout
                          </Button>
                      </SheetFooter>
                  </div>
              )}
            </SheetContent>
          </Sheet>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                    <ListOrdered className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild size="sm">
                <Link to="/signin">Sign In</Link>
             </Button>
          )}
        </div>
      </div>
    </header>
  );
}
