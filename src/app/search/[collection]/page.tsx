import { getCollection, getCollectionProducts } from '@/lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import { defaultSort, sorting } from '@/lib/constants';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
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
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });

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
