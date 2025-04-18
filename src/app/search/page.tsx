import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import FilterList from '@/components/layout/search/filter';
import SearchInput from '@/components/layout/search/SearchInput';
import { getProducts } from '@/lib/api/product';

// export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, category } = searchParams as { [key: string]: string };
  
  // Parse sort parameter
  let sortBy = 'price';
  let sortOrder = 'asc';
  
  if (sort) {
    const [sortField, order] = sort.split('-');
    if (sortField === 'price' || sortField === 'createdAt') {
      sortBy = sortField;
      sortOrder = order || 'asc';
    }
  }
  
  console.log('Sort params:', { sortBy, sortOrder });
  
  const { products, total } = await getProducts({ 
    query: searchValue,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc',
    page: 0,
    limit: 12,
    category
  });

  const resultsText = total > 1 ? 'results' : 'result';

  return (
    <section className="mx-auto flex w-full max-w-[904px] flex-col items-center justify-center gap-[48px] px-4 py-[48px]">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full max-w-[800px] flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            {searchValue ? (
              <div className="text-center">
                <h1 className="font-lora text-3xl font-bold text-[#daa520]">Search Results</h1>
                <p className="mt-2 text-lg text-gray-300">
                  {total === 0
                    ? 'There are no products that match '
                    : `Showing ${total} ${resultsText} for `}
                  <span className="font-bold text-[#daa520]">&quot;{searchValue}&quot;</span>
                </p>
              </div>
            ) : (
              <h1 className="font-lora text-3xl font-bold text-[#daa520]">All Products</h1>
            )}

            <div className="w-full max-w-[500px]">
              <SearchInput />
            </div>
          </div>

          <div className="flex justify-end">
            <FilterList list={[
              { title: 'Price: Low to High', slug: 'price-asc' },
              { title: 'Price: High to Low', slug: 'price-desc' },
              { title: 'Latest', slug: 'createdAt-desc' },
              { title: 'Oldest', slug: 'createdAt-asc' }
            ]} title="Sort by" />
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <Grid className="grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-lg text-gray-300">No products found</p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent"></div>
        </div>
      )}
    </section>
  );
}
