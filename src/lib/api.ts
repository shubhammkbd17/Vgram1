import { supabase, isMockMode } from './supabase';
import { Product, Profile, Order, OrderItem, Review, UserRole, OrderStatus } from './types';

// Seed initial mock data for local storage when in mock mode
const SEED_PRODUCERS: Profile[] = [
  {
    id: 'p1',
    phone: '+919999999901',
    role: 'producer',
    full_name: 'Rajesh Kumar',
    avatar_url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: 'Punjab Farmers Co-op, Ludhiana, Punjab, India',
    location_lat: 30.901,
    location_lng: 75.857,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    phone: '+919999999902',
    role: 'producer',
    full_name: 'Sunita Devi',
    avatar_url: 'https://images.unsplash.com/photo-1595246140625-573b715e11d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: 'Apple Orchards, Shimla, Himachal Pradesh, India',
    location_lat: 31.104,
    location_lng: 77.173,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    phone: '+919999999903',
    role: 'producer',
    full_name: 'Amit Patel',
    avatar_url: 'https://images.unsplash.com/photo-1544252636-f0466c4c5b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: 'Organic Spices Farm, Anand, Gujarat, India',
    location_lat: 22.564,
    location_lng: 72.928,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p4',
    phone: '+919999999904',
    role: 'producer',
    full_name: 'Lakshmi Rao',
    avatar_url: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: 'Coffee Estate, Chikmagalur, Karnataka, India',
    location_lat: 13.315,
    location_lng: 75.775,
    created_at: new Date().toISOString(),
  }
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    producer_id: 'p1',
    title: 'Organic Sharbati Wheat',
    description: 'Traditionally grown Sharbati wheat from the fertile farms of Punjab. Rich in taste and fiber, perfect for soft rotis.',
    price: 65.00,
    unit: 'kg',
    category: 'Grains',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    stock: 250,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod2',
    producer_id: 'p2',
    title: 'Royal Delicious Apples',
    description: 'Crisp, sweet, and juicy Royal Delicious apples handpicked directly from our orchards in Shimla. No chemical sprays.',
    price: 180.00,
    unit: 'kg',
    category: 'Fruits',
    image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    stock: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod3',
    producer_id: 'p3',
    title: 'Pure Organic Turmeric Powder',
    description: 'High-curcumin content turmeric powder processed locally on our spice farms in Gujarat. Unadulterated and full of aroma.',
    price: 240.00,
    unit: 'kg',
    category: 'Organic Goods',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    stock: 50,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod4',
    producer_id: 'p4',
    title: 'Aromatic Arabica Coffee Beans',
    description: 'Single-origin premium Arabica coffee beans grown under shade in Chikmagalur. Medium roast, rich chocolatey notes.',
    price: 450.00,
    unit: '500g',
    category: 'Organic Goods',
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    stock: 40,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod5',
    producer_id: 'p1',
    title: 'Fresh Farm Mustard Greens (Sarson)',
    description: 'Fresh, vibrant green mustard leaves harvested at dawn. Perfect for making traditional Punjabi Sarson ka Saag.',
    price: 40.00,
    unit: 'kg',
    category: 'Vegetables',
    image_url: 'https://images.unsplash.com/photo-1587334206574-351ec379965f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    stock: 80,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod6',
    producer_id: 'p3',
    title: 'Handcrafted Clay Pots',
    description: 'Traditional earthen pots handmade by local artisans. Environmentally friendly and keeps water naturally cool.',
    price: 150.00,
    unit: 'piece',
    category: 'Handicrafts',
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    stock: 15,
    created_at: new Date().toISOString(),
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'r1',
    product_id: 'prod1',
    user_id: 'c1',
    rating: 5,
    comment: 'The quality of the wheat is top-notch. Rotis turn out extremely soft and tasty. Highly recommended!',
    created_at: new Date().toISOString(),
  },
  {
    id: 'r2',
    product_id: 'prod2',
    user_id: 'c1',
    rating: 4,
    comment: 'Very sweet and fresh apples, children loved them. Docking one star because delivery took 3 days.',
    created_at: new Date().toISOString(),
  }
];

// LocalStorage Helper functions
const getLocalData = <T>(key: string, defaultVal: T): T => {
  if (typeof window === 'undefined') return defaultVal;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setLocalData = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
};

// Initialize Mock database in LocalStorage
export const initMockDb = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('vgram_profiles')) {
    setLocalData('vgram_profiles', SEED_PRODUCERS);
  }
  if (!localStorage.getItem('vgram_products')) {
    setLocalData('vgram_products', SEED_PRODUCTS);
  }
  if (!localStorage.getItem('vgram_reviews')) {
    setLocalData('vgram_reviews', SEED_REVIEWS);
  }
  if (!localStorage.getItem('vgram_orders')) {
    setLocalData('vgram_orders', [] as Order[]);
  }
};

// -------------------------------------------------------------
// AUTH OPERATIONS
// -------------------------------------------------------------

export const authAPI = {
  signUp: async (phone: string, role: UserRole, fullName: string): Promise<{ user: any; error: any }> => {
    if (isMockMode) {
      initMockDb();
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      // Check if user already exists
      const existing = users.find(u => u.phone === phone);
      if (existing) {
        return { user: null, error: { message: 'Phone number already registered' } };
      }

      const newUser: Profile = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        phone,
        role,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`,
        address: '',
        location_lat: 28.6139, // Default to New Delhi coordinates
        location_lng: 77.2090,
        created_at: new Date().toISOString(),
      };
      
      users.push(newUser);
      setLocalData('vgram_profiles', users);
      setLocalData('vgram_current_user', newUser);
      return { user: newUser, error: null };
    } else {
      // Supabase Phone Sign Up
      // Supabase doesn't pass roles directly on signup. We will do signUp and then insert profile.
      // For phone login in Supabase, we trigger signInWithOtp which handles sign up as well
      return { user: null, error: 'Phone sign-in is managed via signInWithOtp' };
    }
  },

  signIn: async (phone: string): Promise<{ success: boolean; error: any }> => {
    if (isMockMode) {
      initMockDb();
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      const user = users.find(u => u.phone === phone);
      if (!user) {
        return { success: false, error: { message: 'Phone number not registered. Please sign up.' } };
      }
      // Simulate sending OTP
      return { success: true, error: null };
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      return { success: !error, error };
    }
  },

  verifyOTP: async (phone: string, code: string, signUpRole?: UserRole, signUpName?: string): Promise<{ user: any; error: any }> => {
    if (isMockMode) {
      initMockDb();
      // Code logic: '123456' is our default testing code
      if (code !== '123456') {
        return { user: null, error: { message: 'Invalid OTP code. Use 123456 for testing.' } };
      }

      const users = getLocalData<Profile[]>('vgram_profiles', []);
      let user = users.find(u => u.phone === phone);

      if (!user && signUpRole && signUpName) {
        // If user didn't exist but we had signup details, create them
        user = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          phone,
          role: signUpRole,
          full_name: signUpName,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${signUpName}`,
          address: '',
          location_lat: 28.6139,
          location_lng: 77.2090,
          created_at: new Date().toISOString(),
        };
        users.push(user);
        setLocalData('vgram_profiles', users);
      }

      if (!user) {
        return { user: null, error: { message: 'Phone not found. Complete sign up flow.' } };
      }

      setLocalData('vgram_current_user', user);
      // Trigger a state change event for client UI
      window.dispatchEvent(new Event('auth-change'));
      return { user, error: null };
    } else {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms'
      });

      if (error) return { user: null, error };

      if (data?.user) {
        // Fetch or create profile
        let { data: profile, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (pError || !profile) {
          // Create profile if it does not exist
          const newProfile = {
            id: data.user.id,
            phone: phone,
            role: signUpRole || 'consumer',
            full_name: signUpName || 'New User',
            avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${signUpName || 'User'}`,
            address: '',
            location_lat: 28.6139,
            location_lng: 77.2090,
          };
          const { data: insertedProfile, error: insError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (insError) return { user: null, error: insError };
          profile = insertedProfile;
        }
        return { user: profile, error: null };
      }
      return { user: null, error: { message: 'Authentication failed' } };
    }
  },

  signOut: async (): Promise<{ error: any }> => {
    if (isMockMode) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vgram_current_user');
        window.dispatchEvent(new Event('auth-change'));
      }
      return { error: null };
    } else {
      const { error } = await supabase.auth.signOut();
      return { error };
    }
  },

  getCurrentUser: async (): Promise<Profile | null> => {
    if (isMockMode) {
      initMockDb();
      return getLocalData<Profile | null>('vgram_current_user', null);
    } else {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Supabase auth.getUser error:', authError);
          return null;
        }
        if (!user) return null;
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Supabase fetch user profile error:', profileError);
          return null;
        }
        return profile || null;
      } catch (err) {
        console.error('Unexpected error in getCurrentUser:', err);
        return null;
      }
    }
  }
};

// -------------------------------------------------------------
// PROFILE OPERATIONS
// -------------------------------------------------------------

export const profileAPI = {
  getProfile: async (userId: string): Promise<Profile | null> => {
    if (isMockMode) {
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      return users.find(u => u.id === userId) || null;
    } else {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) {
          console.error('Supabase getProfile error:', error);
          return null;
        }
        return data;
      } catch (err) {
        console.error('Unexpected error in getProfile:', err);
        return null;
      }
    }
  },

  updateProfile: async (userId: string, data: Partial<Profile>): Promise<{ profile: Profile | null; error: any }> => {
    if (isMockMode) {
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) return { profile: null, error: { message: 'User profile not found' } };

      users[index] = { ...users[index], ...data };
      setLocalData('vgram_profiles', users);
      
      const currentUser = getLocalData<Profile | null>('vgram_current_user', null);
      if (currentUser && currentUser.id === userId) {
        setLocalData('vgram_current_user', users[index]);
        window.dispatchEvent(new Event('auth-change'));
      }
      return { profile: users[index], error: null };
    } else {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();
      return { profile, error };
    }
  },

  getProducers: async (): Promise<Profile[]> => {
    if (isMockMode) {
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      return users.filter(u => u.role === 'producer');
    } else {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'producer');
        if (error) {
          console.error('Supabase getProducers error:', error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error('Unexpected error in getProducers:', err);
        return [];
      }
    }
  }
};

// -------------------------------------------------------------
// PRODUCT OPERATIONS
// -------------------------------------------------------------

export const productAPI = {
  getProducts: async (filters?: { category?: string; query?: string; producerId?: string }): Promise<Product[]> => {
    if (isMockMode) {
      initMockDb();
      let products = getLocalData<Product[]>('vgram_products', []);
      const users = getLocalData<Profile[]>('vgram_profiles', []);

      // Join producer info
      products = products.map(prod => ({
        ...prod,
        producer: users.find(u => u.id === prod.producer_id)
      }));

      if (filters?.producerId) {
        products = products.filter(p => p.producer_id === filters.producerId);
      }
      if (filters?.category && filters.category !== 'All') {
        products = products.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return products;
    } else {
      try {
        let query = supabase.from('products').select('*, producer:profiles(*)');
        
        if (filters?.producerId) {
          query = query.eq('producer_id', filters.producerId);
        }
        if (filters?.category && filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }
        if (filters?.query) {
          query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }
        
        const { data, error } = await query;
        if (error) {
          console.error('Supabase getProducts error:', error);
          return [];
        }
        return (data as any) || [];
      } catch (err) {
        console.error('Unexpected error in getProducts:', err);
        return [];
      }
    }
  },

  getProduct: async (id: string): Promise<Product | null> => {
    if (isMockMode) {
      initMockDb();
      const products = getLocalData<Product[]>('vgram_products', []);
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      const product = products.find(p => p.id === id);
      if (!product) return null;
      
      return {
        ...product,
        producer: users.find(u => u.id === product.producer_id)
      };
    } else {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, producer:profiles(*)')
          .eq('id', id)
          .single();
        if (error) {
          console.error('Supabase getProduct error:', error);
          return null;
        }
        return data as any;
      } catch (err) {
        console.error('Unexpected error in getProduct:', err);
        return null;
      }
    }
  },

  createProduct: async (data: Omit<Product, 'id' | 'created_at'>): Promise<{ product: Product | null; error: any }> => {
    if (isMockMode) {
      const products = getLocalData<Product[]>('vgram_products', []);
      const newProduct: Product = {
        ...data,
        id: 'prod_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      products.push(newProduct);
      setLocalData('vgram_products', products);
      return { product: newProduct, error: null };
    } else {
      const { data: product, error } = await supabase
        .from('products')
        .insert(data)
        .select()
        .single();
      return { product, error };
    }
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<{ product: Product | null; error: any }> => {
    if (isMockMode) {
      const products = getLocalData<Product[]>('vgram_products', []);
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return { product: null, error: { message: 'Product not found' } };

      products[index] = { ...products[index], ...data };
      setLocalData('vgram_products', products);
      return { product: products[index], error: null };
    } else {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      return { product, error };
    }
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; error: any }> => {
    if (isMockMode) {
      const products = getLocalData<Product[]>('vgram_products', []);
      const filtered = products.filter(p => p.id !== id);
      setLocalData('vgram_products', filtered);
      return { success: true, error: null };
    } else {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      return { success: !error, error };
    }
  }
};

// -------------------------------------------------------------
// ORDER OPERATIONS
// -------------------------------------------------------------

export const orderAPI = {
  placeOrder: async (
    consumerId: string,
    producerId: string,
    items: { productId: string; quantity: number; price: number }[],
    totalAmount: number,
    deliveryAddress: string
  ): Promise<{ order: Order | null; error: any }> => {
    if (isMockMode) {
      const orders = getLocalData<Order[]>('vgram_orders', []);
      const products = getLocalData<Product[]>('vgram_products', []);
      const users = getLocalData<Profile[]>('vgram_profiles', []);

      const newOrderId = 'ord_' + Math.random().toString(36).substr(2, 9);
      
      // Generate order items
      const orderItems: OrderItem[] = items.map(item => ({
        id: 'ord_item_' + Math.random().toString(36).substr(2, 9),
        order_id: newOrderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: products.find(p => p.id === item.productId)
      }));

      // Deduct stock
      const updatedProducts = products.map(p => {
        const orderItem = items.find(i => i.productId === p.id);
        if (orderItem) {
          return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
        }
        return p;
      });
      setLocalData('vgram_products', updatedProducts);

      const newOrder: Order = {
        id: newOrderId,
        consumer_id: consumerId,
        producer_id: producerId,
        total_amount: totalAmount,
        status: 'pending',
        delivery_address: deliveryAddress,
        created_at: new Date().toISOString(),
        consumer: users.find(u => u.id === consumerId),
        producer: users.find(u => u.id === producerId),
        items: orderItems
      };

      orders.push(newOrder);
      setLocalData('vgram_orders', orders);
      return { order: newOrder, error: null };
    } else {
      // Create order first
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          consumer_id: consumerId,
          producer_id: producerId,
          total_amount: totalAmount,
          delivery_address: deliveryAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderErr || !order) return { order: null, error: orderErr };

      // Create order items
      const dbItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(dbItems);

      if (itemsErr) return { order: null, error: itemsErr };

      // Deduct stocks
      for (const item of items) {
        // Let DB handle it or we update locally
        const { data: prod } = await supabase.from('products').select('stock').eq('id', item.productId).single();
        if (prod) {
          await supabase.from('products').update({ stock: Math.max(0, prod.stock - item.quantity) }).eq('id', item.productId);
        }
      }

      return { order, error: null };
    }
  },

  getOrders: async (userId: string, role: UserRole): Promise<Order[]> => {
    if (isMockMode) {
      const orders = getLocalData<Order[]>('vgram_orders', []);
      if (role === 'producer') {
        return orders.filter(o => o.producer_id === userId);
      } else {
        return orders.filter(o => o.consumer_id === userId);
      }
    } else {
      try {
        const field = role === 'producer' ? 'producer_id' : 'consumer_id';
        const { data, error } = await supabase
          .from('orders')
          .select('*, consumer:profiles(*), producer:profiles(*), items:order_items(*, product:products(*))')
          .eq(field, userId)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getOrders error:', error);
          return [];
        }
        return (data as any) || [];
      } catch (err) {
        console.error('Unexpected error in getOrders:', err);
        return [];
      }
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<{ success: boolean; error: any }> => {
    if (isMockMode) {
      const orders = getLocalData<Order[]>('vgram_orders', []);
      const index = orders.findIndex(o => o.id === orderId);
      if (index === -1) return { success: false, error: { message: 'Order not found' } };

      orders[index].status = status;
      setLocalData('vgram_orders', orders);
      return { success: true, error: null };
    } else {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      return { success: !error, error };
    }
  }
};

// -------------------------------------------------------------
// REVIEW OPERATIONS
// -------------------------------------------------------------

export const reviewAPI = {
  getReviews: async (productId: string): Promise<Review[]> => {
    if (isMockMode) {
      initMockDb();
      const reviews = getLocalData<Review[]>('vgram_reviews', []);
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      return reviews
        .filter(r => r.product_id === productId)
        .map(r => ({
          ...r,
          user: users.find(u => u.id === r.user_id)
        }));
    } else {
      const { data } = await supabase
        .from('reviews')
        .select('*, user:profiles(*)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      return (data as any) || [];
    }
  },

  addReview: async (productId: string, userId: string, rating: number, comment: string): Promise<{ review: Review | null; error: any }> => {
    if (isMockMode) {
      const reviews = getLocalData<Review[]>('vgram_reviews', []);
      const users = getLocalData<Profile[]>('vgram_profiles', []);
      
      // Check if user already reviewed
      const existingIdx = reviews.findIndex(r => r.product_id === productId && r.user_id === userId);
      
      const newReview: Review = {
        id: 'rev_' + Math.random().toString(36).substr(2, 9),
        product_id: productId,
        user_id: userId,
        rating,
        comment,
        created_at: new Date().toISOString(),
        user: users.find(u => u.id === userId)
      };

      if (existingIdx !== -1) {
        reviews[existingIdx] = newReview;
      } else {
        reviews.push(newReview);
      }
      
      setLocalData('vgram_reviews', reviews);
      return { review: newReview, error: null };
    } else {
      const { data: review, error } = await supabase
        .from('reviews')
        .upsert(
          { product_id: productId, user_id: userId, rating, comment },
          { onConflict: 'product_id,user_id' }
        )
        .select()
        .single();
      return { review, error };
    }
  }
};
