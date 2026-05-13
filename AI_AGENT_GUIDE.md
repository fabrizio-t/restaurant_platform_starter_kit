# AI Agent Guide

Use this file when generating a custom restaurant site from this starter.

## Non-Negotiable API Rules

- Use v2 APIs only.
- Do not use `/public/store-menu`, `/public/products`, or `/cart`.
- Treat `src/lib/config.ts` as the first customization point for deployable projects.
- Base URL comes from `LOCAL_CONFIG.apiBaseUrl`, unless `NEXT_PUBLIC_API_BASE_URL` is set.
- Store slug comes from `LOCAL_CONFIG.storeSlug`, unless `NEXT_PUBLIC_STORE_SLUG` is set.
- If the user provides an existing store slug, update `LOCAL_CONFIG.storeSlug` so the project works immediately after deploy. Do not rely on Vercel env vars being configured.
- Keep `LOCAL_CONFIG` deploy-ready because Vercel may have no env vars on first deploy.
- Text fields from v2 are already localized strings.
- Product arrays are at `response.data`.
- Pagination is at `response.meta`.

## Agent Configuration Workflow

When building a custom site, resolve configuration in this order:

1. User instructions in the prompt.
2. `LOCAL_CONFIG` in `src/lib/config.ts`.
3. Environment variables, when the project owner explicitly wants host-level overrides.
4. Store data returned by the API.

Use this workflow for the store slug, API URL, platform checkout URL, language, local theme mode, and any brand/theme decisions. If the prompt gives a slug, put it in `LOCAL_CONFIG.storeSlug`. If the prompt gives brand colors or style direction, update the local light/dark variables in `src/app/globals.css` and keep `LOCAL_CONFIG.localTheme` aligned.

Environment variables are overrides, not the primary setup path. The repository must remain functional when pushed to Vercel without manual env setup.

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

Light and dark are local starter themes. Use `LOCAL_CONFIG.localTheme` or `NEXT_PUBLIC_LOCAL_THEME=light` / `NEXT_PUBLIC_LOCAL_THEME=dark`, then customize their CSS variables in `src/app/globals.css`.

Customize the local default colors from the user's instructions first. If instructions are missing, use the current `LOCAL_CONFIG` and existing CSS variables as the source of truth. Keep both `.light` and `.dark` coherent unless the user explicitly asks for only one mode.

Use the API theme only when `store.defaultTheme === "branded"` and `store.brandedTheme.primaryColor` exists. In that case apply the `branded` class to the document root and inject CSS generated from:

- `primaryColor`
- `backgroundColor`
- `textColor`
- `headerColor`
- `fontFamily`
- `variableOverrides`

If the API returns `light`, `dark`, no theme, or an incomplete branded theme, keep the configured local theme instead. Keep UI components compatible with local light, local dark, and API branded modes.

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
