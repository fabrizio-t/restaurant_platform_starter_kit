import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/config';
import type { Cart, AddItemRequest, UpdateItemRequest, ApiResponse, CreateCartRequest } from '@/types';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}cart/`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // Note: Cart API uses optional auth, so we don't require a token
      // If you want to support logged-in users, you can add token here:
      // const token = localStorage.getItem('token');
      // if (token) {
      //   headers.set('Authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    /**
     * Get cart by session ID
     */
    getCart: builder.query<
      ApiResponse<Cart>,
      { sessionId: string; storeId?: string; lang?: string }
    >({
      query: ({ sessionId, storeId, lang }) => ({
        url: sessionId,
        params: {
          ...(storeId && { storeId }),
          ...(lang && { lang }),
        },
      }),
      providesTags: (result, error, { sessionId }) => [
        { type: 'Cart', id: sessionId },
      ],
    }),

    /**
     * Create a new cart
     * Note: No invalidatesTags - the response already contains the cart data,
     * and the GET query will run separately when storeId is available
     */
    createCart: builder.mutation<ApiResponse<Cart>, CreateCartRequest>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Add item to cart
     */
    addItemToCart: builder.mutation<
      ApiResponse<Cart>,
      { sessionId: string; item: AddItemRequest }
    >({
      query: ({ sessionId, item }) => ({
        url: `${sessionId}/items`,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Cart', id: sessionId },
      ],
    }),

    /**
     * Update cart item
     */
    updateCartItem: builder.mutation<
      ApiResponse<Cart>,
      { sessionId: string; itemId: string; updates: UpdateItemRequest }
    >({
      query: ({ sessionId, itemId, updates }) => ({
        url: `${sessionId}/items/${itemId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Cart', id: sessionId },
      ],
    }),

    /**
     * Remove item from cart
     */
    removeItemFromCart: builder.mutation<
      ApiResponse<Cart>,
      { sessionId: string; itemId: string }
    >({
      query: ({ sessionId, itemId }) => ({
        url: `${sessionId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Cart', id: sessionId },
      ],
    }),

    /**
     * Clear entire cart
     */
    clearCart: builder.mutation<ApiResponse<Cart>, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: sessionId,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Cart', id: sessionId },
      ],
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
