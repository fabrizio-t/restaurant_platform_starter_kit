// ============================================
// MENUOF Starter Project - v2 Type Definitions
// ============================================

export interface ApiResponse<T> {
  status: number;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  status: number;
  error: {
    message: string;
    code?: string;
  };
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StoreLocation {
  streetName?: string;
  streetNumber?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  coordinates?: [string, string];
  fullAddress?: string;
}

export interface StoreContacts {
  phone?: string;
  email?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  tripAdvisor?: string;
  googleMaps?: string;
  website?: string;
}

export interface WeekSchedule {
  [key: string]: string[];
  mon: string[];
  tue: string[];
  wed: string[];
  thu: string[];
  fri: string[];
  sat: string[];
  sun: string[];
}

export interface ActiveClosure {
  id: string;
  start_date: string;
  end_date: string;
  message: string;
  affects: Record<string, unknown>;
}

export interface BrandedTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headerColor?: string;
  fontFamily?: string;
  variableOverrides?: Record<string, string>;
}

export interface Store {
  _id: string;
  slug_url: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  currency?: string;
  timezone?: string;
  language?: string;
  defaultTheme?: 'light' | 'dark' | 'branded';
  brandedTheme?: BrandedTheme;
  location?: StoreLocation;
  contacts?: StoreContacts;
  socialLinks?: SocialLinks;
  settings?: {
    opening_hours?: WeekSchedule;
    payment_methods?: unknown[];
    reservations?: { enabled: boolean };
    orders?: {
      enabled: boolean;
      pickup_enabled: boolean;
      delivery_enabled: boolean;
    };
    active_closures?: ActiveClosure[];
  };
  catalogs: CatalogSummary[];
}

export interface CatalogSummary {
  _id: string;
  name: string;
  image?: string;
  orderTypes: string[];
  slugUrl?: string;
  acceptOrders?: boolean;
  scheduleEnabled?: boolean;
  listed?: boolean;
}

export interface Catalog {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  orderTypes: string[];
  slugUrl?: string;
  acceptOrders?: boolean;
  scheduleEnabled?: boolean;
  categoryNavigationMode?: 'list' | 'visual';
  productDisplayMode?: 'visual' | 'list';
  schedule: WeekSchedule;
  categories: Category[];
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  orderBy?: number;
  productCount?: number;
  children?: Category[];
}

export interface Allergen {
  id: number;
  name: string;
}

export interface ProductImage {
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
  thumbnail?: string;
  alt?: string;
}

export interface VariantItem {
  _id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  allergens?: Allergen[];
  price: number;
  quantity?: number;
  currency?: string;
  images?: ProductImage[];
}

export interface Variant {
  _id: string;
  name: string;
  displayName?: string;
  isMultipleChoice: boolean;
  minChoice: number;
  maxChoice: number;
  items: VariantItem[];
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  allergens?: Allergen[];
  price: number;
  quantity?: number;
  currency?: string;
  images?: ProductImage[];
  isVariant?: boolean;
  isActive?: boolean;
  orderBy?: number;
  variants?: Variant[];
}

// ============================================
// Cart Types
// ============================================

export interface SelectedVariantItemRequest {
  productId: string;
  quantity: number;
}

export interface SelectedVariantRequest {
  variantId: string;
  selectedItems: SelectedVariantItemRequest[];
}

export interface SelectedVariantItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface SelectedVariant {
  variantId: string;
  variantName: string;
  selectedItems: SelectedVariantItem[];
}

export interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string | null;
  categoryIds?: string[];
  quantity: number;
  note?: string;
  selectedVariants: SelectedVariant[];
  itemTotal: number;
}

export interface Cart {
  _id?: string;
  sessionId: string;
  storeId: string | null;
  userId?: string | null;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  storeCurrency?: string;
}

export interface CreateCartRequest {
  sessionId: string;
  storeId: string;
}

export interface AddItemRequest {
  storeId?: string;
  productId: string;
  quantity?: number;
  note?: string;
  selectedVariants?: SelectedVariantRequest[];
}
export interface UpdateItemRequest {
  quantity?: number;
  note?: string;
  selectedVariants?: SelectedVariantRequest[];
}
