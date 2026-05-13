# MENUOF Starter Project

White-label Next.js starter for building custom restaurant websites on top of the MENUOF platform APIs.

The goal is simple: keep the frontend fully customizable, while reusing MENUOF for store data, catalogs, menu browsing, product variants, cart, and checkout handoff.

## Current API Version

This starter uses the MENUOF v2 public API:

- `GET /v2/stores/:slug`
- `GET /v2/stores/:slug/catalogs/:catalogId`
- `GET /v2/stores/:slug/products`
- `GET /v2/cart/:sessionId`
- `POST /v2/cart`
- `POST /v2/cart/:sessionId/items`
- `PUT /v2/cart/:sessionId/items/:itemId`
- `DELETE /v2/cart/:sessionId/items/:itemId`
- `DELETE /v2/cart/:sessionId`

The old `/public/store-menu`, `/public/products`, and `/cart` endpoints are not used by this starter.

## Quick Start

```bash
npm install
npm run dev
```

The starter works without environment variables. Defaults are versioned in `src/lib/config.ts`:

```ts
export const LOCAL_CONFIG = {
  apiBaseUrl: 'https://api.ordina.online/',
  storeSlug: 'pizzaplace',
  menuofPlatformUrl: 'https://ordina.online',
  defaultLanguage: 'it',
  localTheme: 'light',
};
```

Use this local config when you want the repository to deploy immediately on Vercel without manually adding env vars.

For AI-generated custom sites, the agent should update `LOCAL_CONFIG` first: set the correct `storeSlug`, API URL, checkout platform URL, language, and local theme mode there. Environment variables should be treated as optional deployment overrides, not as the only way to make the starter work.

Optionally create `.env.local` from `env.example` to override the local config:

```env
NEXT_PUBLIC_STORE_SLUG=your-store-slug
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/
NEXT_PUBLIC_MENUOF_PLATFORM_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_LOCAL_THEME=light
```

Open:

```text
http://localhost:3000/example_menu_page
```

## Data Flow

1. Load store:
   `GET /v2/stores/:slug?lang=en`

2. Choose a catalog:
   the store response includes lightweight `catalogs[]`.

3. Load full catalog:
   `GET /v2/stores/:slug/catalogs/:catalogId?lang=en`

4. Load products:
   `GET /v2/stores/:slug/products?categoryId=...&page=1&limit=24&lang=en`

5. Search across a catalog:
   `GET /v2/stores/:slug/products?catalogId=...&search=pi&lang=en`

6. Add to cart:
   `POST /v2/cart/:sessionId/items`

7. Checkout handoff:
   redirect to `${NEXT_PUBLIC_MENUOF_PLATFORM_URL}/checkout?sessionId=...`

## Important v2 Shapes

v2 responses use this envelope:

```ts
{
  status: number;
  data: T;
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

Products are returned directly as `response.data`, not `response.data.products`.

Product text is already localized by the backend:

```ts
product.name // string
product.description // string
```

Allergens are structured:

```ts
product.allergens // [{ id: number, name: string }]
```

Images are responsive objects:

```ts
product.images // [{ small, medium, large }]
```

## Theme Support

The starter separates local themes from API-driven branded themes:

- `light`
- `dark`
- `branded`

`light` and `dark` are local starter themes. Select the local fallback theme with `LOCAL_CONFIG.localTheme` in `src/lib/config.ts`, or override it with:

```env
NEXT_PUBLIC_LOCAL_THEME=light
```

Customize their variables in `src/app/globals.css`.

When customizing a site, combine the user's visual instructions with `LOCAL_CONFIG.localTheme` and the CSS variables in `src/app/globals.css`. Keep the local light and dark themes usable even when no API branded theme is available.

`branded` is used only when the store API returns `defaultTheme: "branded"` and a `brandedTheme.primaryColor`. In that case the starter injects CSS variables from:

```ts
store.brandedTheme.primaryColor
store.brandedTheme.backgroundColor
store.brandedTheme.textColor
store.brandedTheme.headerColor
store.brandedTheme.fontFamily
store.brandedTheme.variableOverrides
```

This mirrors the branded theme configured from the MENUOF dashboard under admin store info.

## Key Files

| File | Purpose |
| --- | --- |
| `src/features/public/publicApi.ts` | v2 store/catalog/product RTK Query endpoints |
| `src/features/cart/cartApi.ts` | v2 cart RTK Query endpoints |
| `src/types/index.ts` | v2 API and cart types |
| `src/app/example_menu_page/page.tsx` | Full working example |
| `src/components/MenuDisplay.tsx` | Category, search, products, pagination |
| `src/components/ProductModal.tsx` | Variants and add-to-cart |
| `src/lib/theme-utils.ts` | Branded theme CSS generation |
| `src/lib/config.ts` | Env config, image helpers, checkout URL |

## For Custom Builds

Use this starter as a functional base, not as a design constraint. Replace layout, styling, navigation, and page composition freely. Keep these contracts stable:

- Keep v2 endpoint paths.
- Keep `sessionId` cart storage and checkout redirect.
- Pass `store._id` as `storeId` when adding cart items.
- Send selected variant items as product IDs:

```ts
selectedVariants: [
  {
    variantId: 'variant-group-id',
    selectedItems: [{ productId: 'variant-item-id', quantity: 1 }]
  }
]
```

## Not Included Yet

This starter focuses on e-commerce menu and cart. The v2 backend also exposes reservations and blog endpoints; add them when the custom site requires those features.
