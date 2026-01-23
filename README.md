# MENUOF Starter Project

A white-label Next.js starter template showcasing reusable components for building custom restaurant websites that connect to the MENUOF platform. This project is designed to be used as a reference for AI agents to understand and reuse components when creating custom designs.

## Purpose

This starter project provides:
- **Reusable Components**: Pre-built React components for menu display, cart management, and product selection
- **Working Example**: A fully functional example menu page at `/example_menu_page`
- **API Integration**: Ready-to-use RTK Query hooks for the MENUOF API
- **Type Definitions**: Comprehensive TypeScript types for all data structures

## Features

- **Menu Display**: Beautifully display your restaurant's menu with categories, products, and variants
- **Cart Management**: Full shopping cart functionality with add, update, and remove items
- **Lazy Cart Creation**: Cart is only created when user adds first item (optimized API usage)
- **Variant Selection**: Support for product variants (sizes, toppings, extras)
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Built-in dark mode support
- **Multi-language**: Support for multiple languages via localized content
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **RTK Query**: Efficient data fetching with automatic caching and optimized refetch policies

## Quick Start

### Prerequisites

- Node.js 18+ 
- A MENUOF store with products configured
- Access to the MENUOF API

### Installation

1. **Clone or copy this starter project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_STORE_SLUG=your-store-slug
   NEXT_PUBLIC_API_BASE_URL=https://api.ordina.online/
   NEXT_PUBLIC_MENUOF_PLATFORM_URL=https://your-store.ordina.online
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to see the landing page with available examples.
   
   Click on "View Example Menu Page" or go directly to `http://localhost:3000/example_menu_page` to see the full menu example.

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_STORE_SLUG` | Your store's unique identifier | Yes | `demo` |
| `NEXT_PUBLIC_API_BASE_URL` | MENUOF API endpoint | Yes | `http://localhost:3001/` |
| `NEXT_PUBLIC_MENUOF_PLATFORM_URL` | Platform URL for checkout | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_BUCKET_URL` | Image storage bucket URL | Yes | Cloudflare R2 URL |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Default language code | No | `en` |

### Finding Your Store Slug

Your store slug is the unique identifier for your restaurant on MENUOF. You can find it:
1. In your MENUOF admin dashboard
2. In the URL when viewing your store: `https://your-store-slug.ordina.online`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page with component overview
│   ├── example_menu_page/
│   │   └── page.tsx            # Full working menu example
│   ├── providers.tsx           # Redux + Cart providers
│   └── globals.css             # Global styles
├── components/
│   ├── CartButton.tsx          # Floating/inline cart button
│   ├── CartDrawer.tsx          # Slide-out cart panel
│   ├── CategoryNav.tsx         # Category navigation
│   ├── Header.tsx              # Site header
│   ├── MenuDisplay.tsx         # Main menu component
│   ├── ProductCard.tsx         # Product display card
│   ├── ProductModal.tsx        # Product detail modal
│   └── index.ts                # Component exports
├── features/
│   ├── cart/
│   │   ├── cartApi.ts          # Cart API endpoints (RTK Query)
│   │   └── CartProvider.tsx    # Cart context & hooks
│   └── public/
│       └── publicApi.ts        # Public store/menu API (RTK Query)
├── lib/
│   └── config.ts               # Configuration & utilities
├── store/
│   └── store.ts                # Redux store setup
└── types/
    └── index.ts                # TypeScript definitions
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page listing available components and link to example |
| `/example_menu_page` | Full working menu page example with all components in action |

## Customization

### Styling

This project uses Tailwind CSS. Customize the theme in `src/app/globals.css`:

```css
:root {
  /* Primary color - customize for your brand */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  /* ... etc */
  --primary-600: #2563eb;  /* Main brand color */
}
```

### Components

All components are in `src/components/` and can be customized:

- **Header**: Modify `Header.tsx` to add navigation, logo, etc.
- **ProductCard**: Customize the product display layout
- **CartDrawer**: Modify the cart appearance and behavior
- **CategoryNav**: Change the category navigation style

### Adding Pages

Create new pages in the `src/app/` directory following Next.js App Router conventions:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About our restaurant</div>;
}
```

For custom menu page designs, use the components from `src/components/` and refer to `/example_menu_page/page.tsx` as a reference implementation.

## API Integration

### Public API Endpoints

The starter uses these MENUOF public API endpoints:

- `GET /public/store-menu/:storeSlug` - Store info, catalogs, categories
- `GET /public/products/:storeSlug` - Products by category

### Cart API Endpoints

- `GET /cart/:sessionId` - Get cart
- `POST /cart/` - Create cart (called lazily when first item is added)
- `POST /cart/:sessionId/items` - Add item
- `PUT /cart/:sessionId/items/:itemId` - Update item
- `DELETE /cart/:sessionId/items/:itemId` - Remove item

> **Note**: The cart is created lazily - no POST request is made until the user adds their first item. This optimizes API usage on page load.

### Using the Cart Hook

```tsx
import { useCart } from '@/features/cart/CartProvider';

function MyComponent() {
  const { 
    cart,
    addItem,
    updateItem,
    removeItem,
    itemCount,
    subtotal 
  } = useCart();

  const handleAddToCart = async () => {
    await addItem({
      productId: 'product-id',
      quantity: 1,
      storeId: 'store-id',
      selectedVariants: [
        {
          variantId: 'variant-id',
          selectedItems: [{ productId: 'item-id', quantity: 1 }]
        }
      ]
    });
  };
}
```

## Checkout Flow

When customers click "Checkout", they are redirected to the MENUOF platform:

1. Cart session ID is passed via URL parameter
2. Customer logs in or signs up on MENUOF
3. Customer completes their order on MENUOF
4. Order is processed by your restaurant

The redirect URL is configured via `NEXT_PUBLIC_MENUOF_PLATFORM_URL`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Troubleshooting

### Store Not Found

If you see "Store Not Found" error:
1. Verify your `NEXT_PUBLIC_STORE_SLUG` is correct
2. Ensure the MENUOF API is accessible
3. Check that your store has active catalogs and products

### Cart Not Working

1. Check browser console for API errors
2. Verify `NEXT_PUBLIC_API_BASE_URL` is correct
3. Ensure the store ID matches your store

### Images Not Loading

1. Configure Next.js image domains in `next.config.ts`:
   ```ts
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'your-image-domain.com',
       }
     ]
   }
   ```
   
   The starter already includes common domains (AWS, Cloudflare R2, internetok.it). Add new domains as needed.

## Support

For issues related to:
- **This starter template**: Open an issue in this repository
- **MENUOF platform**: Contact MENUOF support

## License

This starter project is provided for use with the MENUOF platform.
