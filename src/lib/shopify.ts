import { Product } from '@/lib/shopify/types';
import { revalidateTag } from 'next/cache';

// Mock data
const mockMenu = {
  items: [
    {
      title: 'Home',
      url: '/',
      items: []
    },
    {
      title: 'Shop',
      url: '/search',
      items: []
    },
    {
      title: 'About',
      url: '/about',
      items: []
    },
    {
      title: 'Contact',
      url: '/contact',
      items: []
    }
  ]
};

const mockProducts = [
  {
    id: '1',
    title: 'Product 100',
    handle: 'product-1',
    description: 'This is a mock product',
    descriptionHtml: '<p>This is a mock product</p>',
    availableForSale: true,
    options: [
      {
        id: '1',
        name: 'Color',
        values: ['Red', 'Blue']
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: '/images/mock-product-1.jpg',
      altText: 'Product 1',
      width: 800,
      height: 800
    },
    images: [
      {
        url: '/images/mock-product-1.jpg',
        altText: 'Product 1',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: '1',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [
          {
            name: 'Color',
            value: 'Red'
          }
        ],
        price: {
          amount: '29.99',
          currencyCode: 'USD'
        },
        image: {
          url: '/images/mock-product-1.jpg',
          altText: 'Product 1',
          width: 800,
          height: 800
        }
      }
    ],
    seo: {
      title: 'Product 1',
      description: 'This is a mock product'
    },
    tags: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Product 2',
    handle: 'product-2',
    description: 'This is another mock product',
    descriptionHtml: '<p>This is another mock product</p>',
    availableForSale: true,
    options: [
      {
        id: '1',
        name: 'Color',
        values: ['Green', 'Yellow']
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '39.99',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '39.99',
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: '/images/mock-product-2.jpg',
      altText: 'Product 2',
      width: 800,
      height: 800
    },
    images: [
      {
        url: '/images/mock-product-2.jpg',
        altText: 'Product 2',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: '2',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [
          {
            name: 'Color',
            value: 'Green'
          }
        ],
        price: {
          amount: '39.99',
          currencyCode: 'USD'
        },
        image: {
          url: '/images/mock-product-2.jpg',
          altText: 'Product 2',
          width: 800,
          height: 800
        }
      }
    ],
    seo: {
      title: 'Product 2',
      description: 'This is another mock product'
    },
    tags: [],
    updatedAt: new Date().toISOString()
  }
];

const mockCart = {
  id: 'mock-cart-id',
  checkoutUrl: '/checkout',
  totalQuantity: 0,
  lines: [],
  cost: {
    totalAmount: {
      amount: '0.00',
      currencyCode: 'USD'
    },
    subtotalAmount: {
      amount: '0.00',
      currencyCode: 'USD'
    },
    totalTaxAmount: {
      amount: '0.00',
      currencyCode: 'USD'
    }
  }
};

// Mock implementations
export async function getMenu(handle: string) {
  try {
    const response = await fetch('http://localhost:8081/api/menu');
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      items: data.menu.map((item: { title: string; path: string; items: any[] }) => ({
        title: item.title,
        url: item.path,
        items: item.items || []
      }))
    };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return {
      items: [
        {
          title: 'All Products',
          url: '/search',
          items: []
        }
      ]
    };
  }
}

export async function getProducts({
  query,
  sortBy,
  sortOrder,
  page,
  limit,
  category,
  sortKey,
  reverse,
  first
}: {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  category?: string;
  sortKey?: string;
  reverse?: boolean;
  first?: number;
}) {
  let filteredProducts = [...mockProducts];

  if (query) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (sortBy === 'price' || sortKey === 'PRICE') {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.maxVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.maxVariantPrice.amount);
      return (sortOrder === 'asc' || !reverse) ? priceA - priceB : priceB - priceA;
    });
  }

  if (first) {
    filteredProducts = filteredProducts.slice(0, first);
  }

  return {
    products: filteredProducts.map(product => ({
      id: product.id,
      handle: product.handle,
      availableForSale: product.availableForSale,
      title: product.title,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      options: product.options,
      priceRange: product.priceRange,
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        selectedOptions: variant.selectedOptions,
        price: variant.price,
        image: variant.image
      })),
      images: product.images.map(image => ({
        url: image.url,
        altText: image.altText,
        width: image.width,
        height: image.height
      })),
      featuredImage: {
        url: product.featuredImage.url,
        altText: product.featuredImage.altText,
        width: product.featuredImage.width,
        height: product.featuredImage.height
      },
      seo: product.seo,
      tags: product.tags,
      updatedAt: product.updatedAt
    })),
    total: filteredProducts.length
  };
}

export async function getProduct(handle: string) {
  try {
    const response = await fetch(`http://localhost:8081/api/products/${handle}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    
    const { data: product } = await response.json();
    
    // Transform the data to match the expected Product type
    return {
      id: product.id,
      handle: product.handle,
      availableForSale: true,
      title: product.title,
      description: product.description,
      descriptionHtml: `<p>${product.description}</p>`,
      options: [
        {
          id: '1',
          name: 'Size',
          values: product.variants.map((v: any) => v.title.split(' ')[0])
        }
      ],
      priceRange: {
        maxVariantPrice: {
          amount: product.price.toString(),
          currencyCode: 'INR'
        },
        minVariantPrice: {
          amount: product.price.toString(),
          currencyCode: 'INR'
        }
      },
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        selectedOptions: [
          {
            name: 'Size',
            value: variant.title.split(' ')[0]
          }
        ],
        price: {
          amount: variant.price.toString(),
          currencyCode: 'INR'
        },
        image: {
          originalSrc: product.images[0]?.url || ''
        }
      })),
      images: product.images.map((image: any) => ({
        url: image.url,
        altText: image.altText || product.title,
        width: 800,
        height: 800
      })),
      featuredImage: {
        url: product.images[0]?.url || '',
        altText: product.images[0]?.altText || product.title,
        width: 800,
        height: 800
      },
      seo: product.seo || {
        title: product.title,
        description: product.description
      },
      tags: [],
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCart(cartId: string) {
  return mockCart;
}

export async function createCart() {
  return mockCart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  return mockCart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  return mockCart;
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]) {
  return mockCart;
}

export async function getPage(handle: string) {
  return {
    id: 'mock-page-id',
    title: 'Mock Page',
    handle,
    body: '<p>This is a mock page content</p>',
    bodySummary: 'Mock page summary',
    seo: {
      title: 'Mock Page',
      description: 'This is a mock page'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function getCollection(handle: string) {
  return {
    id: 'mock-collection-id',
    title: 'Mock Collection',
    handle,
    description: 'This is a mock collection',
    seo: {
      title: 'Mock Collection',
      description: 'This is a mock collection'
    }
  };
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse
}: {
  collection: string;
  sortKey?: string;
  reverse?: boolean;
}) {
  try {
    console.log('Fetching collection products with params:', { collection, sortKey, reverse }); // Debug log

    const params = new URLSearchParams();
    // Map collection to category for the API
    const category = collection === 'topwear' ? 'Shirts' : collection;
    params.append('category', category);

    const url = `http://localhost:8081/api/products/best-sellers?${params.toString()}`;
    console.log('Fetching from URL:', url); // Debug log

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error response:', await response.text()); // Debug log
      throw new Error(`Failed to fetch collection products: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received data:', data); // Debug log
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch collection products');
    }

    // Transform the response data to match Product type
    const products: Product[] = data.data.flatMap((categoryData: any) => 
      categoryData.products.map((product: any) => ({
        id: product.id,
        handle: product.handle,
        availableForSale: true,
        title: product.title,
        description: product.description,
        descriptionHtml: `<p>${product.description}</p>`,
        options: [
          {
            id: 'size',
            name: 'Size',
            values: product.variants.map((variant: any) => variant.title)
          }
        ],
        priceRange: {
          maxVariantPrice: {
            amount: product.price.toString(),
            currencyCode: 'INR'
          },
          minVariantPrice: {
            amount: product.price.toString(),
            currencyCode: 'INR'
          }
        },
        variants: product.variants.map((variant: any) => ({
          id: variant.id,
          title: variant.title,
          availableForSale: true,
          selectedOptions: [
            {
              name: 'Size',
              value: variant.title
            }
          ],
          price: {
            amount: variant.price.toString(),
            currencyCode: 'INR'
          }
        })),
        images: product.images.map((image: any) => ({
          url: image.url,
          altText: image.altText || product.title,
          width: 800,
          height: 800
        })),
        featuredImage: {
          url: product.images[0]?.url || '',
          altText: product.images[0]?.altText || product.title,
          width: 800,
          height: 800
        },
        seo: {
          title: product.title,
          description: product.description
        },
        tags: [],
        updatedAt: new Date().toISOString()
      }))
    );

    console.log('Transformed products:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
}

export async function revalidate(req: Request) {
  const body = await req.json();
  const { tag, secret } = body;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  if (!tag) {
    return new Response('Missing tag param', { status: 400 });
  }

  revalidateTag(tag);

  return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function getProductRecommendations(productId: string) {
  try {
    const response = await fetch(`http://localhost:8081/api/products/${productId}/recommendations`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations: ${response.status}`);
    }
    
    const { data: products } = await response.json();
    
    // Transform the data to match the expected Product type
    return products.map((product: any) => ({
      id: product.id,
      handle: product.handle,
      availableForSale: true,
      title: product.title,
      description: product.description,
      descriptionHtml: `<p>${product.description}</p>`,
      options: [
        {
          id: '1',
          name: 'Size',
          values: product.variants.map((v: any) => v.title.split(' ')[0])
        }
      ],
      priceRange: {
        maxVariantPrice: {
          amount: product.price.toString(),
          currencyCode: 'INR'
        },
        minVariantPrice: {
          amount: product.price.toString(),
          currencyCode: 'INR'
        }
      },
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        selectedOptions: [
          {
            name: 'Size',
            value: variant.title.split(' ')[0]
          }
        ],
        price: {
          amount: variant.price.toString(),
          currencyCode: 'INR'
        },
        image: {
          originalSrc: product.images[0]?.url || ''
        }
      })),
      images: product.images.map((image: any) => ({
        url: image.url,
        altText: image.altText || product.title,
        width: 800,
        height: 800
      })),
      featuredImage: {
        url: product.images[0]?.url || '',
        altText: product.images[0]?.altText || product.title,
        width: 800,
        height: 800
      },
      seo: product.seo || {
        title: product.title,
        description: product.description
      },
      tags: [],
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

export async function getBestSellers(category?: 'Shirts' | 'Jeans' | 'Perfumes' | 'Topwear' | 'All', limit?: number): Promise<Product[]> {
  try {
    console.log('Fetching best sellers with params:', { category, limit }); // Debug log

    const params = new URLSearchParams();
    if (category && category !== 'All') {
      // Map Topwear to Shirts for the API
      const apiCategory = category === 'Topwear' ? 'Shirts' : category;
      params.append('category', apiCategory);
    }
    if (limit) params.append('limit', limit.toString());

    const url = `http://localhost:8081/api/products/best-sellers?${params.toString()}`;
    console.log('Fetching from URL:', url); // Debug log

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error response:', await response.text()); // Debug log
      throw new Error(`Failed to fetch best sellers: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received data:', data); // Debug log
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch best sellers');
    }

    // Transform the response data to match Product type
    const products: Product[] = data.data.flatMap((categoryData: any) => 
      categoryData.products.map((product: any) => ({
        id: product.id,
        handle: product.handle,
        availableForSale: true,
        title: product.title,
        description: product.description,
        descriptionHtml: `<p>${product.description}</p>`,
        options: [
          {
            id: 'size',
            name: 'Size',
            values: product.variants.map((variant: any) => variant.title)
          }
        ],
        priceRange: {
          maxVariantPrice: {
            amount: product.price.toString(),
            currencyCode: 'INR'
          },
          minVariantPrice: {
            amount: product.price.toString(),
            currencyCode: 'INR'
          }
        },
        variants: product.variants.map((variant: any) => ({
          id: variant.id,
          title: variant.title,
          availableForSale: true,
          selectedOptions: [
            {
              name: 'Size',
              value: variant.title
            }
          ],
          price: {
            amount: variant.price.toString(),
            currencyCode: 'INR'
          }
        })),
        images: product.images.map((image: any) => ({
          url: image.url,
          altText: image.altText || product.title,
          width: 800,
          height: 800
        })),
        featuredImage: {
          url: product.images[0]?.url || '',
          altText: product.images[0]?.altText || product.title,
          width: 800,
          height: 800
        },
        seo: {
          title: product.title,
          description: product.description
        },
        tags: [],
        updatedAt: new Date().toISOString()
      }))
    );

    console.log('Transformed products:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}
