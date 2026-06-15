export type UserRole = 'producer' | 'consumer';

export type OrderStatus = 'pending' | 'accepted' | 'shipping' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  phone: string | null;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
}

export interface Product {
  id: string;
  producer_id: string;
  title: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  image_url: string | null;
  stock: number;
  created_at: string;
  producer?: Profile; // Joined data
}

export interface Order {
  id: string;
  consumer_id: string | null;
  producer_id: string | null;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  created_at: string;
  consumer?: Profile;
  producer?: Profile;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: Profile;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
