// shopify

// components
import ProductList from './ProductList';

const NewArrivals = async () => {
  const response = await fetch('https://backend-production-909b.up.railway.app/api/products?sortBy=createdAt&sortOrder=desc&page=0&limit=6');
  const { products } = await response.json();
  
  return (
    <section className="flex w-full items-center justify-center bg-black pb-[48px] pt-[24px] md:pt-[48px]">
      <div className="flex flex-col items-center justify-center gap-[24px] w-full px-5 md:w-[904px] md:gap-[48px]">
        <h2 className="w-full text-center font-lora text-[clamp(28px,20px_+_2vw,40px)] font-medium text-[#D4AF37] md:text-left">
          New Arrivals
        </h2>
        <ProductList products={products} />
        <a href="/search?sort=createdAt-desc" className="btn text-[clamp(18px,10px_+_2vw,22px)]">
          View More
        </a>
      </div>
    </section>
  );
};

export default NewArrivals;
