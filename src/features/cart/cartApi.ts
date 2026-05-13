import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ORIGIN } from '@/lib/config';
import type { AddItemRequest, ApiResponse, Cart, CreateCartRequest, UpdateItemRequest } from '@/types';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_ORIGIN}/v2/cart`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, { sessionId: string; storeId?: string; lang?: string }>({
      query: ({ sessionId, storeId, lang }) => ({
        url: `/${sessionId}`,
        params: {
          ...(storeId && { storeId }),
          ...(lang && { lang }),
        },
      }),
      providesTags: (result, error, { sessionId }) => [{ type: 'Cart', id: sessionId }],
    }),

    createCart: builder.mutation<ApiResponse<Cart>, CreateCartRequest>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) => result ? [{ type: 'Cart', id: result.data.sessionId }] : [],
    }),

    addItemToCart: builder.mutation<ApiResponse<Cart>, { sessionId: string; item: AddItemRequest }>({
      query: ({ sessionId, item }) => ({
        url: `/${sessionId}/items`,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: (result, error, { sessionId }) => [{ type: 'Cart', id: sessionId }],
    }),

    updateCartItem: builder.mutation<
      ApiResponse<Cart>,
      { sessionId: string; itemId: string; updates: UpdateItemRequest }
    >({
      query: ({ sessionId, itemId, updates }) => ({
        url: `/${sessionId}/items/${itemId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { sessionId }) => [{ type: 'Cart', id: sessionId }],
    }),

    removeItemFromCart: builder.mutation<ApiResponse<Cart>, { sessionId: string; itemId: string }>({
      query: ({ sessionId, itemId }) => ({
        url: `/${sessionId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { sessionId }) => [{ type: 'Cart', id: sessionId }],
    }),

    clearCart: builder.mutation<ApiResponse<Cart>, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { sessionId }) => [{ type: 'Cart', id: sessionId }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useCreateCartMutation,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
  useClearCartMutation,
} = cartApi;
