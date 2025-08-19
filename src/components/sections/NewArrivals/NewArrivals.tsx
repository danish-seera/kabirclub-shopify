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
      <section className="flex w-full items-center justify-center bg-black pb-[48px] pt-[24px] md:pt-[48px]">
        <div className="flex flex-col items-center justify-center gap-[24px] w-full px-5 md:w-[904px] md:gap-[48px]">
          <h2 className="w-full text-center font-lora text-[clamp(28px,20px_+_2vw,40px)] font-medium text-[#D4AF37] md:text-left">
            New Arrivals
          </h2>
          <ProductList products={safeProducts} />
          <a href="/search?sort=createdAt-desc" className="btn text-[clamp(18px,10px_+_2vw,22px)]">
            View More
          </a>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading New Arrivals:', error);
    // Return fallback UI if there's an error
    return (
      <section className="flex w-full items-center justify-center bg-black pb-[48px] pt-[24px] md:pt-[48px]">
        <div className="flex flex-col items-center justify-center gap-[24px] w-full px-5 md:w-[904px] md:gap-[48px]">
          <h2 className="w-full text-center font-lora text-[clamp(28px,20px_+_2vw,40px)] font-medium text-[#D4AF37] md:text-left">
            New Arrivals
          </h2>
          <div className="text-center text-gray-500">
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }
};

export default NewArrivals;
