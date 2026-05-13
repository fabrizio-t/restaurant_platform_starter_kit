# AI Agent Guide

Use this file when generating a custom restaurant site from this starter.

## Non-Negotiable API Rules

- Use v2 APIs only.
- Do not use `/public/store-menu`, `/public/products`, or `/cart`.
- Base URL comes from `NEXT_PUBLIC_API_BASE_URL`.
- Store slug comes from `NEXT_PUBLIC_STORE_SLUG`.
- Text fields from v2 are already localized strings.
- Product arrays are at `response.data`.
- Pagination is at `response.meta`.

## Recommended First Screen

Build the actual restaurant experience first:

- Store header or hero using `store.name`, `store.logo`, `store.banner`.
- Catalog selector if `store.catalogs.length > 1`.
- Category navigation from full catalog `categories`.
- Product list from `/v2/stores/:slug/products`.
- Cart button/drawer if ordering is enabled.

Avoid making a marketing landing page unless explicitly requested.

## API Sequence

```ts
const store = await GET('/v2/stores/:slug?lang=it');
const catalogId = store.catalogs[0]._id;
const catalog = await GET(`/v2/stores/:slug/catalogs/${catalogId}?lang=it`);
const products = await GET(`/v2/stores/:slug/products?categoryId=${categoryId}&lang=it&page=1&limit=24`);
```

For search:

```ts
GET /v2/stores/:slug/products?catalogId=:catalogId&search=pizza&lang=it
```

## Cart Sequence

The starter creates a stable anonymous `sessionId` in localStorage.

```ts
POST /v2/cart
{
  "sessionId": "...",
  "storeId": "..."
}
```

```ts
POST /v2/cart/:sessionId/items
{
  "storeId": "...",
  "productId": "...",
  "quantity": 1,
  "selectedVariants": [
    {
      "variantId": "...",
      "selectedItems": [{ "productId": "...", "quantity": 1 }]
    }
  ]
}
```

Checkout:

```ts
window.location.href = `${NEXT_PUBLIC_MENUOF_PLATFORM_URL}/checkout?sessionId=${sessionId}`;
```

## Theme Rules

If `store.defaultTheme` is `light`, `dark`, or `branded`, apply that class to the document root.

If `store.brandedTheme.primaryColor` exists, inject CSS generated from:

- `primaryColor`
- `backgroundColor`
- `textColor`
- `headerColor`
- `fontFamily`
- `variableOverrides`

Keep UI components compatible with all three modes.

## Safe Customization

Good places to customize:

- `src/app/example_menu_page/page.tsx`
- `src/components/Header.tsx`
- `src/components/MenuDisplay.tsx`
- `src/components/ProductCard.tsx`
- `src/components/ProductModal.tsx`
- `src/app/globals.css`

Keep these files accurate to the platform contract:

- `src/features/public/publicApi.ts`
- `src/features/cart/cartApi.ts`
- `src/types/index.ts`
- `src/features/cart/CartProvider.tsx`

