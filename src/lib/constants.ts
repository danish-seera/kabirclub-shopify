export const SITE_NAME = 'KabirClub';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SITE_DESCRIPTION = 'Premium clothing and accessories';

export const SITE_KEYWORDS = ['clothing', 'fashion', 'accessories', 'premium'];

export const SITE_AUTHOR = 'KabirClub Team';

export const SITE_IMAGE = '/images/logo.png';

export const SITE_FAVICON = '/favicon.png';

export const SITE_MANIFEST = '/manifest.json';

export const SITE_THEME_COLOR = '#daa520';

export const SITE_BACKGROUND_COLOR = '#ffffff';

export const SITE_DISPLAY = 'standalone';

export const SITE_ORIENTATION = 'portrait';

export const SITE_SCOPE = '/';

export const SITE_START_URL = '/';

export const SITE_CATEGORY = 'shopping';

export const SITE_LANG = 'en';

export const SITE_DIR = 'ltr';

export const SITE_ICONS = [
  {
    src: '/favicon.png',
    sizes: '32x32',
    type: 'image/png'
  },
  {
    src: '/images/logo.png',
    sizes: '192x192',
    type: 'image/png'
  }
];

export const SITE_SHORTCUTS = [
  {
    name: 'Home',
    short_name: 'Home',
    description: 'Go to homepage',
    url: '/',
    icons: [
      {
        src: '/favicon.png',
        sizes: '32x32'
      }
    ]
  }
];

export const SITE_SCREENS = [
  {
    src: '/screenshots/screenshot-desktop.png',
    sizes: '1280x720',
    type: 'image/png',
    form_factor: 'wide'
  },
  {
    src: '/screenshots/screenshot-mobile.png',
    sizes: '750x1334',
    type: 'image/png',
    form_factor: 'narrow'
  }
];

export const SITE_CATEGORIES = [
  'Topwear',
  'Bottomwear',
  'Accessories'
];

export const SITE_SORT_OPTIONS = [
  { label: 'Latest', value: 'created_at-desc' },
  { label: 'Oldest', value: 'created_at-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
];

export const SITE_PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

export const SITE_CART = {
  MAX_ITEMS: 100,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
};

export const SITE_CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN'
};

export const SITE_TAX = {
  RATE: 0.18, // 18% GST
  INCLUSIVE: false
};

export const SITE_SHIPPING = {
  FREE_THRESHOLD: 2000, // Free shipping above ₹2000
  STANDARD_COST: 200,
  EXPRESS_COST: 400
};
