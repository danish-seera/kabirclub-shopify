import { getCollection, getCollectionProducts } from '@/lib/supabase/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.title,
    description: collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  
  let sortBy = 'created_at';
  let sortOrder = 'desc';
  
  if (sort) {
    const [sortField, order] = sort.split('-');
    if (sortField === 'price' || sortField === 'created_at') {
      sortBy = sortField === 'created_at' ? 'created_at' : 'price';
      sortOrder = order || 'desc';
    }
  }
  
  const products = await getCollectionProducts({ 
    collection: params.collection, 
    sortBy, 
    sortOrder: sortOrder as 'asc' | 'desc' 
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <div className="flex flex-col items-center justify-center gap-[48px]">
          <h2 className="font-lora text-3xl font-bold capitalize text-darkPurple">
            {params.collection.replace('-', ' ')}
          </h2>
          <Grid className="grid-cols-1 items-start justify-center sm:grid-cols-2 lg:grid-cols-3">
            {/* @ts-ignore */}
            <ProductGridItems products={products} />
          </Grid>
        </div>
      )}
    </section>
  );
}
