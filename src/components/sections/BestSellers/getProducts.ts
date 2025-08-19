'use server';

// supabase
import { getCollectionProducts } from '@/lib/supabase/api';

// types
import { Collection } from '.';

export const getProducts = async (collection: Collection, count = 5) => {
  return await getCollectionProducts({ 
    collection, 
    sortBy: 'created_at',
    sortOrder: 'desc',
    limit: count
  });
};
