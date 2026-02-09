export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // URL to image
  category: string;
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
