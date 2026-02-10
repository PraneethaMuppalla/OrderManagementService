import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAddToCart } from "@/hooks/useCart";
import { Plus, Minus, Loader2 } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      menuItemId: product.id,
      quantity: quantity,
    });
    // Reset quantity after adding (optional, maybe keep it?)
    // setQuantity(1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
           <Badge variant="secondary" className="w-fit">{product.category}</Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
            <span className="font-bold text-primary">₹{product.price}</span>
        </div>
        <CardDescription className="line-clamp-2 text-sm text-gray-500 min-h-[40px]">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-500">Qty:</span>
            <div className="flex items-center gap-2 border rounded-md p-0.5">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-sm" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || isPending}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-4 text-center tabular-nums">{quantity}</span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-sm" 
                    onClick={incrementQuantity}
                    disabled={isPending}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </div>
        <Button 
          className="w-full" 
          onClick={handleAddToCart} 
          size="sm"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              Add to Cart - ₹{(parseFloat(product.price) * quantity).toFixed(2)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
