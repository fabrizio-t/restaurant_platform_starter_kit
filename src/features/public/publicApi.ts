import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/config';
import type {
  ApiResponse,
  UnifiedStoreMenuResponse,
  PublicProductsResponse,
  PublicStoreResponse,
} from '@/types';

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}public/`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['PublicStore', 'PublicCategories', 'PublicProducts'],
  // Reduce cache time for fresher data
  keepUnusedDataFor: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    /**
     * Get unified store menu - store info, catalogs, and categories
     * This is the main endpoint to initialize the menu display
     */
    getUnifiedStoreMenu: builder.query<
      ApiResponse<UnifiedStoreMenuResponse>,
      { storeSlug: string; language?: string }
    >({
      query: ({ storeSlug, language = 'en' }) => ({
        url: `store-menu/${storeSlug}`,
        params: { lang: language },
      }),
      providesTags: (result, error, { storeSlug }) => [
        { type: 'PublicStore', id: storeSlug },
        { type: 'PublicCategories', id: `${storeSlug}-unified` },
      ],
    }),

    /**
     * Get products by category - paginated
     */
    getPublicProducts: builder.query<
      ApiResponse<PublicProductsResponse>,
      {
        storeSlug: string;
        categoryId: string;
        language?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ storeSlug, categoryId, language = 'en', page = 1, limit = 20 }) => ({
        url: `products/${storeSlug}`,
        params: {
          categoryId,
          lang: language,
          page,
          limit,
        },
      }),
      // Short cache time for products to ensure fresh data
      keepUnusedDataFor: 30,
      providesTags: (result, error, { storeSlug, categoryId, page }) => [
        { type: 'PublicProducts', id: `${storeSlug}-${categoryId}-${page}` },
      ],
    }),

    /**
     * Get basic store information
     */
    getPublicStore: builder.query<
      ApiResponse<PublicStoreResponse>,
      { storeSlug: string; language?: string }
    >({
      query: ({ storeSlug, language = 'en' }) => ({
        url: `store/${storeSlug}`,
        params: { lang: language },
      }),
      providesTags: (result, error, { storeSlug }) => [
        { type: 'PublicStore', id: storeSlug },
      ],
    }),
  }),
});

export const {
  useGetUnifiedStoreMenuQuery,
  useLazyGetUnifiedStoreMenuQuery,
  useGetPublicProductsQuery,
  useLazyGetPublicProductsQuery,
  useGetPublicStoreQuery,
  useLazyGetPublicStoreQuery,
} = publicApi;
