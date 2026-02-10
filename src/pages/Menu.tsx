import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { useInfiniteMenu, useMenuCategories } from "@/hooks/useMenu";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Button } from "@/components/ui/button";

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useMenuCategories();

  // Fetch menu items with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMenu({
    category: selectedCategory,
    search: debouncedSearch,
    limit: 8,
  });

  // Flatten all pages into a single array of products
  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage ?? false,
    rootMargin: '200px', // Start loading 200px before reaching the bottom
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Our Menu</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Categories
                {categoriesData?.summary && ` (${categoriesData.summary.totalAvailable})`}
              </SelectItem>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : (
                categoriesData?.categories.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat.availableItems})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Initial Loading State */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="absolute! -m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading menu items...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p className="text-lg font-semibold">Error loading menu</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Failed to load menu items'}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No items found</p>
          {(debouncedSearch || selectedCategory !== 'all') && (
            <p className="text-sm mt-2">Try adjusting your filters</p>
          )}
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Trigger (Intersection Observer Target) */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center items-center py-8">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading more items...</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage}
                >
                  Load More
                </Button>
              )}
            </div>
          )}

          {/* End of Results Indicator */}
          {!hasNextPage && products.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">You've reached the end of the menu</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
