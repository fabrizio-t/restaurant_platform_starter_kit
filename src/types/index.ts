// ============================================
// MENUOF Starter Project - Type Definitions
// ============================================

// Multi-language content type
export interface MultiLanguageContent {
  [key: string]: string | undefined;
  en?: string;
  es?: string;
  fr?: string;
  it?: string;
  de?: string;
  pt?: string;
  ru?: string;
  zh?: string;
}

// ============================================
// Store Types
// ============================================

export interface StoreLocation {
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  coordinates: [string, string];
  fullAddress: string;
}

export interface StoreContacts {
  phone?: string;
  email?: string;
}

export interface StoreSettings {
  opening_hours: {
    mon: string[];
    tue: string[];
    wed: string[];
    thu: string[];
    fri: string[];
    sat: string[];
    sun: string[];
  };
  payment_methods: string[];
  takeaway?: {
    enabled: boolean;
    minimum_order_notice?: number;
  };
  delivery?: {
    enabled: boolean;
    minimum_order_notice?: number;
    delivery_areas?: Array<{
      name: string;
      polygon: number[][];
      cost: string;
      free_delivery_threshold: string;
    }>;
  };
}

export interface Store {
  _id: string;
  name: string | MultiLanguageContent;
  description?: string | MultiLanguageContent;
  logo?: string;
  banner?: string;
  language?: string;
  timezone?: string;
  slug_url?: string;
  location?: StoreLocation;
  contacts?: StoreContacts;
  settings?: StoreSettings;
  currency?: string;
  isActive?: boolean;
  catalogs?: Catalog[];
}

// ============================================
// Catalog Types
// ============================================

export interface Catalog {
  _id: string;
  slugUrl?: string;
  name: string | MultiLanguageContent;
  description?: string | MultiLanguageContent | null;
  image?: string;
  orderTypes: string[];
  schedule: {
    mon: string[];
    tue: string[];
    wed: string[];
    thu: string[];
    fri: string[];
    sat: string[];
    sun: string[];
  };
  isActive: boolean;
  orderBy: number;
  categories?: Category[];
}

// ============================================
// Category Types
// ============================================

export interface Category {
  _id: string;
  name: string | MultiLanguageContent;
  image?: string;
  isActive: boolean;
  orderBy: number;
  productCount?: number;
  products?: Product[];
  children: Category[];
}

// ============================================
// Product Types
// ============================================

export interface ProductImage {
  original?: string;
  medium?: string;
  thumbnail?: string;
}

export interface VariantItem {
  _id: string;
  name: string | MultiLanguageContent;
  description?: string | MultiLanguageContent;
  ingredients?: string[];
  allergens?: string[];
  price: number;
  quantity?: number;
  currency?: string;
  images?: ProductImage[];
  isActive?: boolean;
  orderBy?: number;
}

export interface Variant {
  _id: string;
  name: string | MultiLanguageContent;
  displayName?: string | MultiLanguageContent;
  isMultipleChoice: boolean;
  minChoice: number;
  maxChoice: number;
  items: VariantItem[];
}

export interface Product {
  _id: string;
  name: string | MultiLanguageContent;
  description?: string | MultiLanguageContent;
  ingredients?: string[];
  allergens?: string[];
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

// Types for data SENT to the backend (just IDs)
export interface SelectedVariantItemRequest {
  productId: string;
  quantity: number;
}

export interface SelectedVariantRequest {
  variantId: string;
  selectedItems: SelectedVariantItemRequest[];
}

// Types for data RECEIVED from the backend (populated with details)
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
  productImage?: string;
  categoryIds?: string[];
  quantity: number;
  note?: string;
  selectedVariants: SelectedVariant[];
  itemTotal: number;
}

export interface Cart {
  _id?: string;
  sessionId: string;
  storeId: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// API Request types
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

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

export interface ApiMeta {
  language: string;
  fallbackLanguage?: string;
  storeSlug?: string;
  catalogId?: string;
  categoryId?: string;
  totalCategories?: number;
  totalProducts?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  lastUpdated: string;
}

// Public API Response Types
export interface UnifiedStoreMenuResponse {
  store: Store;
  catalogs: Catalog[];
  selectedCatalog: Catalog | null;
  requiresCatalogSelection: boolean;
  meta: ApiMeta;
}

export interface PublicProductsResponse {
  store: {
    _id: string;
    name: string;
    slug_url: string;
  };
  catalog: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
    image?: string;
    isActive: boolean;
    orderBy: number;
  };
  products: Product[];
  meta: ApiMeta;
}

export interface PublicStoreResponse {
  store: Store;
  meta?: ApiMeta;
}
