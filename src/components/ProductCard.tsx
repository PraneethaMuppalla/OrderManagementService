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
import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/store/cartSlice";
import { toast } from "sonner"; // Assuming sonner or toast component is available, will add later if needed or basic alert
import { Plus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.image}
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
            <span className="font-bold text-primary">₹{product.price.toFixed(2)}</span>
        </div>
        <CardDescription className="line-clamp-2 text-sm text-gray-500 min-h-[40px]">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full" onClick={handleAddToCart} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
