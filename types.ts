
export interface StoryPart {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  type: 'process' | 'origin' | 'quality';
}

export interface Certificate {
  id: string;
  name: string;
  issuedBy: string;
  validUntil: string;
  verificationUrl: string;
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  additionalPrice: number;
  stock: number;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ProductLogistics {
  weight: number;
  dimensions: { length: number; width: number; height: number };
  sku: string;
  barcode?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  images: string[];
  videoUrl?: string;
  stock: number;
  rating: number;
  reviews: Review[];
  featured?: boolean;
  tags?: string[];
  variants?: Variant[];
  logistics: ProductLogistics;
  seo: ProductSEO;
  status: 'active' | 'draft' | 'archived';
  adminNotes?: string;
  // Principal Enhancements
  story?: StoryPart[];
  certificates?: Certificate[];
  isVerified?: boolean;
  authenticityID?: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  rank?: string; // "Amateur", "Pâtissier", "Executive Chef"
  loyaltyPoints: number;
  badges: UserBadge[];
  preferences?: {
    currency: string;
    language: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentStatus: 'paid' | 'unpaid';
  shippingAddress: string;
  trackingUpdates?: { time: string; status: string; location: string }[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  visible: boolean;
  description?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  isActive: boolean;
  minOrderAmount?: number;
  usageCount: number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  timestamp: string;
  details: string;
}

export interface UserActivity {
  id: string;
  type: 'view' | 'add_to_cart' | 'search' | 'checkout_start' | 'purchase';
  productId?: string;
  query?: string;
  timestamp: string;
  metadata?: any;
}
