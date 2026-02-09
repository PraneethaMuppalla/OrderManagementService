import { useState, useEffect } from 'react';
import { ShoppingCart, LogOut } from 'lucide-react';
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
import { removeFromCart, updateQuantity, setCartOpen } from '@/store/cartSlice';
import { logout } from '@/store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            FoodOrder
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
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
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
              <SheetHeader>
                <SheetTitle>Your Cart ({totalItems})</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 -mr-6 pr-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex space-x-4">
                        <div className="h-16 w-16 rounded overflow-hidden bg-muted">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-sm font-medium text-muted-foreground">
                            ₹{item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon-xs"
                              className="h-6 w-6"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            >
                              -
                            </Button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon-xs"
                              className="h-6 w-6"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            >
                              +
                            </Button>
                            <Button
                                variant="ghost"
                                size="xs"
                                className="text-destructive h-6 ml-auto"
                                onClick={() => dispatch(removeFromCart(item.id))}
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
                  <SheetFooter className="mt-auto border-t pt-4 sm:justify-center">
                      <div className="w-full space-y-4">
                          <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span>₹{totalPrice.toFixed(2)}</span>
                          </div>
                          <Button className="w-full" size="lg" onClick={() => {
                              dispatch(setCartOpen(false));
                              navigate('/checkout');
                          }}>
                              Proceed to Checkout
                          </Button>
                      </div>
                  </SheetFooter>
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
