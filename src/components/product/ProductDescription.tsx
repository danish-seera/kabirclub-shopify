import { Product } from '@/lib/supabase/types';
import Price from '../common/price';

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
        <p className="text-lg text-gray-600">{product.description}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Price
          amount={product.price.toString()}
          currencyCode="INR"
          className="text-3xl font-bold text-[#daa520]"
        />
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
          {product.category}
        </span>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Product ID:</strong> {product.id}</p>
          <p><strong>Added:</strong> {new Date(product.created_at).toLocaleDateString()}</p>
          <p><strong>Last Updated:</strong> {new Date(product.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
