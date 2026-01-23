import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          MENUOF Starter Project
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This is a starter project showcasing reusable components for building 
          custom restaurant menu pages. The components are designed to be easily 
          customized and integrated into your own designs.
        </p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Available Examples
          </h2>
          
          <Link
            href="/example_menu_page"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <span>View Example Menu Page</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Available Components
          </h3>
          <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Header</code>
              <span>- Store header with logo and cart</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">CategoryNav</code>
              <span>- Category navigation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">MenuDisplay</code>
              <span>- Product grid with category filtering</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">ProductCard</code>
              <span>- Individual product display</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">ProductModal</code>
              <span>- Product detail modal</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">CartDrawer</code>
              <span>- Shopping cart sidebar</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">CartButton</code>
              <span>- Floating cart button</span>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Powered by MENUOF
        </p>
      </div>
    </div>
  );
}
