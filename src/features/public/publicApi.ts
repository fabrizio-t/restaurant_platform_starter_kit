import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ORIGIN } from '@/lib/config';
import type { ApiResponse, Catalog, Product, Store } from '@/types';

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ORIGIN,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Store', 'Catalog', 'Products'],
  keepUnusedDataFor: 300,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getStore: builder.query<ApiResponse<Store>, { storeSlug: string; language?: string }>({
      query: ({ storeSlug, language = 'en' }) => ({
        url: `/v2/stores/${storeSlug}`,
        params: { lang: language },
      }),
      providesTags: (result, error, { storeSlug }) => [{ type: 'Store', id: storeSlug }],
    }),

    getCatalog: builder.query<
      ApiResponse<Catalog>,
      { storeSlug: string; catalogId: string; language?: string }
    >({
      query: ({ storeSlug, catalogId, language = 'en' }) => ({
        url: `/v2/stores/${storeSlug}/catalogs/${catalogId}`,
        params: { lang: language },
      }),
      providesTags: (result, error, { storeSlug, catalogId }) => [
        { type: 'Catalog', id: `${storeSlug}-${catalogId}` },
      ],
    }),

    getProducts: builder.query<
      ApiResponse<Product[]>,
      {
        storeSlug: string;
        categoryId?: string;
        catalogId?: string;
        language?: string;
        page?: number;
        limit?: number;
        search?: string;
        excludeAllergens?: string;
      }
    >({
      query: ({
        storeSlug,
        categoryId,
        catalogId,
        language = 'en',
        page = 1,
        limit = 20,
        search,
        excludeAllergens,
      }) => ({
        url: `/v2/stores/${storeSlug}/products`,
        params: {
          ...(categoryId && { categoryId }),
          ...(catalogId && { catalogId }),
          lang: language,
          page,
          limit,
          ...(search && { search }),
          ...(excludeAllergens && { excludeAllergens }),
        },
      }),
      keepUnusedDataFor: 30,
      providesTags: (result, error, { storeSlug, categoryId, catalogId, page, search, excludeAllergens }) => [
        {
          type: 'Products',
          id: `${storeSlug}-${categoryId || catalogId || 'all'}-${page || 1}-${search || ''}-${excludeAllergens || ''}`,
        },
      ],
    }),
  }),
});

export const {
  useGetStoreQuery,
  useLazyGetStoreQuery,
  useGetCatalogQuery,
  useLazyGetCatalogQuery,
  useGetProductsQuery,
  useLazyGetProductsQuery,
} = publicApi;
