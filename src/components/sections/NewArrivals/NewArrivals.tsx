// supabase
import { getProducts } from '@/lib/supabase/api';

// components
import ProductList from './ProductList';

const NewArrivals = async () => {
  try {
    const result = await getProducts({
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 0,
      limit: 6
    });
    
    // Ensure products is always an array
    const safeProducts = Array.isArray(result.products) ? result.products : [];
    
    return (
      <section className="flex w-full items-center justify-center bg-black pb-8 sm:pb-12 md:pb-16 pt-6 sm:pt-8 md:pt-12">
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 w-full max-w-[95%] px-3 sm:px-4 md:max-w-[904px]">
          <h2 className="w-full text-center font-lora text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-[#D4AF37]">
            New Arrivals
          </h2>
          <ProductList products={safeProducts} />
          <a href="/search?sort=createdAt-desc" className="btn text-base sm:text-lg md:text-xl lg:text-[22px] px-6 sm:px-8 py-2 sm:py-3">
            View More
          </a>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading New Arrivals:', error);
    // Return fallback UI if there's an error
    return (
      <section className="flex w-full items-center justify-center bg-black pb-8 sm:pb-12 md:pb-16 pt-6 sm:pt-8 md:pt-12">
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-[95%] px-3 sm:px-4 md:max-w-[904px]">
          <h2 className="w-full text-center font-lora text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-[#D4AF37]">
            New Arrivals
          </h2>
          <div className="text-center text-gray-500">
            <p className="text-sm sm:text-base">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }
};

export default NewArrivals;
