// components
import Categories from './Categories';
import CopyRight from './CopyRight';
import SocialMedia from './SocialMedia';

const index = () => {
  return (
    <footer className="bg-black text-white border-t border-[#daa520]/30 w-full overflow-hidden">
      <h2 className="sr-only">Footer</h2>
      
      {/* Top decorative border */}
      <div className="h-1 w-full bg-gradient-to-r from-[#daa520] via-[#f5d76e] to-[#daa520]"></div>
      
      {/* Main content */}
      <div className="mx-auto max-w-[95%] py-12 md:max-w-[1200px] md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Categories section */}
          <div className="relative">
            <div className="absolute -left-3 top-0 h-12 w-1 bg-[#daa520]/40 rounded-full"></div>
            <Categories />
          </div>
          
          {/* Social Media section */}
          <div className="relative">
            <div className="absolute -left-3 top-0 h-12 w-1 bg-[#daa520]/40 rounded-full"></div>
            <SocialMedia />
          </div>
          
          {/* About/Contact section */}
          <div className="relative md:col-span-2 lg:col-span-1">
            <div className="absolute -left-3 top-0 h-12 w-1 bg-[#daa520]/40 rounded-full"></div>
            <h3 className="text-[20px] font-semibold text-[#daa520] mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center gap-2">
                <span className="text-[#daa520]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                </span>
                +91 7991812899
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#daa520]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </span>
                kabirclub50@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#daa520]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </span>
                Kabirclub, India
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[#daa520]/30 to-transparent"></div>
        
        {/* Copyright section */}
        <div className="text-center">
          <CopyRight />
          <p className="mt-3 text-xs text-gray-500">
          </p>
        </div>
      </div>
    </footer>
  );
};

export default index;
