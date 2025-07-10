import Image from 'next/image';
import { getFeaturedNews } from '@/lib/featured';
import { formatDate } from '@/lib/news';

export default function FeaturedNewsSection() {
  const featuredNews = getFeaturedNews();

  return (
    <div className="w-full bg-[#1A1A1A] h-[350px] relative z-10">
      <div className="max-w-8xl mx-auto h-full flex items-center px-6 gap-x-6 z-20 relative">
        <div className="w-[45%] pl-6">
          <div className="w-full h-[400px] relative border shadow-lg">
            <Image
              src={featuredNews?.meta.image || "/images/Competition.png"}
              alt={featuredNews?.meta.title || "Featured News"}
              fill
              className="object-cover rounded-sm"
              priority
            />
          </div>
        </div>

        <div className="w-[55%] max-w-[85rem]">
          <div className="text-white p-6 rounded-md bg-opacity-60">
            <h2 className="font-geist font-black text-xl md:text-2xl mb-2">Featured News</h2>
            <h3 className="font-geist font-bold text-[#FED018] text-lg mb-2">
              {featuredNews?.meta.title || "Latest PTI Updates"}
            </h3>
            {featuredNews?.meta.date && (
              <p className="font-geist text-sm text-gray-300 mb-4">
                {formatDate(featuredNews.meta.date)}
              </p>
            )}
            <p className="font-geist text-sm mb-6 leading-relaxed text-justify">
              {featuredNews?.meta.description || "Stay updated with the latest news and announcements from the Philippine Taekwondo Institute."}
            </p>
            <a
              href="/featured/featured1"
              className="text-[#FED018] font-semibold inline-flex items-center gap-2 group"
            >
              Discover the full story
              <span
                className="text-2xl transition-transform duration-300 ease-in-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
