const AboutUs = () => {
  return (
    <section className="relative bg-black py-16 md:py-24 w-full overflow-hidden">
      <h2 className="sr-only">About us</h2>
      
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#daa520] via-[#f5d76e] to-[#daa520]"></div>
      <div className="absolute bottom-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#daa520]/5 blur-3xl"></div>
      <div className="absolute left-0 top-1/3 h-32 w-32 rounded-full bg-[#daa520]/5 blur-2xl"></div>
      
      <div className="relative mx-auto max-w-[95%] md:max-w-[800px]">
        {/* Decorative quotes */}
        <div className="absolute -left-4 -top-4 text-6xl text-[#daa520]/20 md:-left-8 md:-top-8 md:text-8xl">"</div>
        <div className="absolute -bottom-4 -right-4 text-6xl text-[#daa520]/20 md:-bottom-8 md:-right-8 md:text-8xl">"</div>
        
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-[#daa520]/20 bg-black/60 p-8 text-center backdrop-blur-sm md:p-12">
          {/* Gold line above heading */}
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#daa520] to-transparent"></div>
          
          <h3 className="font-lora text-[clamp(28px,18px_+_2vw,40px)] font-semibold text-[#daa520]">
            Premium Men's Fashion Destination
          </h3>
          
          <p className="max-w-[90%] font-lora text-[clamp(18px,14px_+_1vw,22px)] font-medium leading-relaxed text-gray-300 md:max-w-none md:leading-normal">
            At Kabirclub, we offer a handpicked collection of high-quality men's clothing - from stylish t-shirts and shirts to perfectly fitted jeans. Every piece is crafted with attention to detail, ensuring both comfort and style for the modern man.
          </p>
          
          {/* Gold line below text */}
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent"></div>
          
          <a 
            href="/about-us" 
            className="group relative overflow-hidden rounded-full border border-[#daa520] bg-transparent px-8 py-3 text-[clamp(16px,10px_+_1vw,18px)] font-medium text-[#daa520] transition-all duration-300 hover:bg-[#daa520]/10"
          >
            <span className="relative z-10">Discover Our Story</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#daa520]/20 to-transparent transition-transform duration-300 group-hover:translate-x-0"></span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
