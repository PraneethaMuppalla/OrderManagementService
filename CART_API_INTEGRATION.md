# Cart API Integration - Complete Guide

## 🎯 Overview

Successfully integrated backend cart API with TanStack Query, replacing the local Redux cart state with server-synchronized cart management.

---

## 📁 Files Created

### 1. **`src/services/cartService.ts`**
Cart API service with all CRUD operations:
- `getCart()` - Fetch user's cart
- `addToCart(data)` - Add item to cart
- `updateCartItem(itemId, data)` - Update quantity
- `removeFromCart(itemId)` - Remove item
- `clearCart()` - Clear entire cart

### 2. **`src/hooks/useCart.ts`**
TanStack Query hooks for cart operations:
- `useCart()` - Fetch cart with caching
- `useAddToCart()` - Mutation for adding items
- `useUpdateCartItem()` - Mutation for updating quantity
- `useRemoveFromCart()` - Mutation for removing items
- `useClearCart()` - Mutation for clearing cart

---

## 📝 Files Modified

### 1. **`src/types/index.ts`**
Added backend cart types:
```typescript
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  is_available: boolean;
  inventory_count: number;
  low_stock_threshold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCartItem {
  id: number;
  menuItemId: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  quantity: number;
  itemTotal: number;
  is_available: boolean;
  inventory_count: number;
  available_now?: number;
  is_available_now?: boolean;
  availability_warning?: string | null;
}

export interface BackendCart {
  id: number;
  userId: number;
  items: BackendCartItem[];
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  cart: BackendCart;
}
```

### 2. **`src/components/ProductCard.tsx`**
- Replaced Redux `addToCart` with `useAddToCart` mutation
- Added loading state to "Add to Cart" button
- Shows spinner while adding item

### 3. **`src/components/Header.tsx`**
- Replaced Redux cart state with `useCart()` hook
- Udpated to use `Loader2` for loading states
- Updated all cart operations to use mutations
- Cart now syncs with backend in real-time

### 4. **`src/pages/Checkout.tsx`**
- Updated to use `useCart()` for fetching cart data
- Updated to use `useClearCart()` for clearing cart after order
- Handles loading and empty states properly

---

## 🔄 Data Flow

```
User Action (Add to Cart)
    ↓
useAddToCart() mutation
    ↓
POST /api/cart/items { menuItemId, quantity }
    ↓
Backend Response (includes reservation info)
    ↓
TanStack Query invalidates 'cart' query
    ↓
useCart() refetches fresh data
    ↓
UI re-renders with new cart data
    ↓
Toast notification shown
```

---

## 🎨 API Endpoints Used

### **GET /api/cart**
Fetch user's cart
```bash
curl --location 'http://localhost:5000/api/cart' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "cart": {
    "id": 5,
    "userId": 1,
    "items": [
      {
        "id": 5,
        "menuItemId": 87,
        "name": "Margherita Pizza",
        "price": 11.99,
        "quantity": 20,
        "itemTotal": 239.8,
        "is_available": true,
        ...
      }
    ],
    "itemCount": 20,
    "subtotal": 239.8,
    ...
  }
}
```

### **POST /api/cart/items**
Add item to cart
```bash
curl --location 'http://localhost:5000/api/cart/items' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data '{
  "menuItemId": 87,
  "quantity": 4
}'
```

**Response:**
```json
{
    "message": "Item added to cart",
    "cart": { ... },
    "reservation": {
        "reserved": 6,
        "available": 44
    }
}
```

### **PUT /api/cart/items/:itemId**
Update cart item quantity
```bash
curl --location 'http://localhost:5000/api/cart/items/5' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data '{
  "quantity": 20
}'
```

### **DELETE /api/cart/items/:itemId**
Remove item from cart
```bash
curl --location 'http://localhost:5000/api/cart/items/5' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

### **DELETE /api/cart/clear**
Clear entire cart
```bash
curl --location 'http://localhost:5000/api/cart/clear' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

---

## ✨ Features Implemented

### ✅ **Server-Synchronized Cart**
- Cart persists across sessions
- Synced across devices
- No data loss on refresh

### ✅ **Optimistic Updates**
- Instant UI feedback
- Automatic cache updates
- Rollback on error

### ✅ **Loading States**
- Button shows spinner while adding
- Disabled during API calls
- Better UX

### ✅ **Toast Notifications**
- Success messages for all operations
- Error messages with details
- User-friendly feedback

### ✅ **Smart Caching**
- 1-minute stale time (cart changes frequently)
- 5-minute cache time
- Automatic refetch on window focus

### ✅ **Error Handling**
- Graceful error messages
- Retry logic (1 retry)
- User-friendly error display

---

## 🔧 Key Differences from Redux Cart

| Feature | Redux (Old) | API + TanStack Query (New) |
|---------|-------------|----------------------------|
| **Storage** | Local state only | Backend database |
| **Persistence** | Lost on refresh | Persists across sessions |
| **Sync** | Single device | Multi-device sync |
| **Loading States** | Manual | Automatic |
| **Error Handling** | Manual | Built-in |
| **Caching** | None | Smart caching |
| **Optimistic Updates** | Manual | Automatic |

---

## 📊 Cart State Management

### **Before (Redux):**
```typescript
const { items, isOpen } = useAppSelector((state) => state.cart);
dispatch(addToCart(product));
dispatch(updateQuantity({ id, quantity }));
dispatch(removeFromCart(id));
```

### **After (TanStack Query):**
```typescript
const { data: cartData } = useCart();
const { mutate: addToCart } = useAddToCart();
const { mutate: updateCartItem } = useUpdateCartItem();
const { mutate: removeFromCart } = useRemoveFromCart();

// Usage
addToCart({ menuItemId: 87, quantity: 1 });
updateCartItem({ itemId: 1, data: { quantity: 3 } });
removeFromCart(1);
```

---

## 🎯 Important Notes

### **Price Type Difference**
- **Menu items**: `price` is `string` (e.g., "12.99")
- **Cart items**: `price` is `number` (e.g., 12.99)

This is intentional - backend calculates totals with numbers.

### **Item IDs**
- **menuItemId**: ID of the menu item (from products table)
- **id**: ID of the cart item (from cart_items table)

Use `menuItemId` when adding to cart, use `id` for update/remove.

### **Quantity Updates**
Backend handles quantity validation:
- Minimum: 1
- Maximum: Based on inventory
- Quantity 0 = item removed

---

## 🧪 Testing Checklist

- [ ] Add item to cart from menu
- [ ] Cart badge shows correct count
- [ ] Open cart sheet
- [ ] Increase item quantity
- [ ] Decrease item quantity
- [ ] Remove item from cart
- [ ] Cart total updates correctly
- [ ] Proceed to checkout
- [ ] Cart persists after refresh
- [ ] Error handling works
- [ ] Loading states appear
- [ ] Toast notifications show

---

## 🚀 Benefits

✅ **Data Persistence** - Cart survives page refresh  
✅ **Multi-Device Sync** - Same cart on all devices  
✅ **Backend Validation** - Inventory checks, price calculations  
✅ **Better UX** - Loading states, error handling  
✅ **Scalability** - Can add features like saved carts, cart sharing  
✅ **Analytics** - Track cart abandonment, popular items  
✅ **Security** - Cart data validated server-side  

---

## 🔄 Migration Notes

### **Redux Cart Slice**
The `cartSlice.ts` is still in the codebase but no longer used for cart items. You can:
1. Keep it for backward compatibility
2. Remove it if no longer needed
3. Repurpose it for UI state (cart open/closed)

### **Backward Compatibility**
If you need to support both local and server cart:
1. Check if user is authenticated
2. Use API cart if logged in
3. Fall back to Redux cart if not logged in

---

## 📚 Next Steps

Potential enhancements:
1. **Cart Sync on Login** - Merge local cart with server cart
2. **Save for Later** - Move items to wishlist
3. **Cart Expiry** - Auto-clear old cart items
4. **Promo Codes** - Apply discounts
5. **Cart Analytics** - Track abandonment
6. **Guest Cart** - Support anonymous users

---

## 🎉 Result

Your cart is now fully integrated with the backend API, providing a robust, scalable, and user-friendly shopping cart experience! 🛒✨
