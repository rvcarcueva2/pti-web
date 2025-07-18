import Image from 'next/image';
import { getFeaturedNews } from '@/lib/featured';
import { formatDate } from '@/lib/news';

export default function FeaturedNewsSection() {
  const featuredNews = getFeaturedNews();

  return (
    <div className="w-full bg-[#1A1A1A] relative z-10 mt-0 md:mt-16">
      <div className="max-w-8xl mx-auto h-auto md:h-[350px] flex flex-col md:flex-row items-start md:items-center px-4 md:px-6 gap-y-6 md:gap-x-6 z-20 relative py-6 md:py-0">
            
          {/* IMAGE */}
          <div className="w-full md:w-[45%] pl-0 md:pl-6 max-w-xs mx-auto md:max-w-none">
            <div className="relative w-full h-[160px] sm:h-[200px] md:h-[400px] border shadow-lg">
              <Image
                src={featuredNews?.meta.image || "/images/Competition.png"}
                alt={featuredNews?.meta.title || "Featured News"}
                fill
                className="object-cover md:rounded-sm"
                priority
              />
            </div>
          </div>
            
          {/* TEXT CONTENT */}
          <div className="w-full md:w-[55%] max-w-[85rem]">
            <div className="text-white p-4 md:p-6 rounded-md bg-opacity-60">
              <>
                {/* h4 for mobile only */}
                <h4 className="block md:hidden font-geist font-black text-base mb-2">
                  Featured News
                </h4>
                {/* h2 for desktop and up */}
                <h2 className="hidden md:block font-geist font-black text-2xl mb-2">
                  Featured News
                </h2>
              </>
              <>
                {/* h5 for mobile only */}
                <h5 className="block md:hidden font-geist font-bold text-[#FED018] text-base mb-2">
                  {featuredNews?.meta.title || "Latest PTI Updates"}
                </h5>
                {/* h3 for desktop and up */}
                <h3 className="hidden md:block font-geist font-bold text-[#FED018] text-lg mb-2">
                  {featuredNews?.meta.title || "Latest PTI Updates"}
                </h3>
              </>

              {featuredNews?.meta.date && (
              <p className="text-responsive font-geist text-sm text-gray-300 mb-4">
                {formatDate(featuredNews.meta.date)}
              </p>
              )}

              <p className="text-responsive font-geist text-sm mb-6 leading-relaxed text-justify">
                {featuredNews?.meta.description || "Stay updated with the latest news and announcements from the Philippine Taekwondo Institute."}
              </p>

              <a
                href="/featured/featured1"
                className="text-[#FED018] font-semibold inline-flex items-center gap-2 group"
              >
                Discover the full story
                <span className="text-2xl transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
      </div>
    </div>
  );
}