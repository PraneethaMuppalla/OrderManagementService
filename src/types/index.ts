export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  is_available: boolean;
  inventory_count: number;
  low_stock_threshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DeliveryDetails {
  name: string;
  address: string;
  phoneNumber: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Order Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  deliveryDetails: DeliveryDetails;
  createdAt: string;
}

export interface CategoryInfo {
  category: string;
  totalItems: number;
  availableItems: number;
  avgPrice: number;
}

export interface CategoriesResponse {
  categories: CategoryInfo[];
  summary: {
    totalCategories: number;
    totalItems: number;
    totalAvailable: number;
  };
}

// Backend cart types
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
  cartId: number;
  menuItemId: number;
  quantity: number;
  itemTotal: string;
  available_now?: number;
  is_available_now?: boolean;
  availability_warning?: string | null;
  createdAt: string;
  updatedAt: string;
  menuItem: MenuItem;
}

export interface BackendCart {
  id: number;
  userId: number;
  items: BackendCartItem[];
  itemCount: number;
  subtotal: string;
  total: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  cart: BackendCart;
}

// Response types for cart mutations
export interface CartItemWithMenuItem {
  id: number;
  cartId: number;
  menuItemId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  menuItem: MenuItem;
}

export interface ReservationInfo {
  reserved: number;
  available: number;
}

export interface AddToCartResponse {
  message: string;
  cart: {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    items: CartItemWithMenuItem[];
  };
  reservation: ReservationInfo;
}

export interface UpdateCartItemResponse {
  message: string;
  cartItem: CartItemWithMenuItem;
  reservation: ReservationInfo;
}

export interface BackendOrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price_at_order: string;
  menuItem?: MenuItem;
}

export interface BackendOrder {
  id: number;
  userId: number;
  total_amount: number;
  status: string;
  delivery_name: string;
  delivery_address: string;
  delivery_phone: string;
  createdAt: string;
  updatedAt: string;
  items: BackendOrderItem[];
}
