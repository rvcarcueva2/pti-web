import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import { getAllNews } from '@/lib/news';
import { getFeaturedNews } from '@/lib/featured';

export default function News() {
    const allNews = getAllNews();
    const featuredNews = getFeaturedNews();

    return (
        <main className="pt-16 pb-10">
            <div className="flex justify-center items-center mb-8">
                <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
                    NEWS
                </h1>
            </div>

            {/* Featured News Section - Static Content */}
            <div className="w-full bg-[#1A1A1A] h-[350px] relative z-10 mt-16 space-y-6">
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
                            <h3 className="font-geist font-bold text-[#FED018] text-lg mb-4">
                                {featuredNews?.meta.title || "Latest PTI Updates"}
                            </h3>
                            <p className="font-geist text-sm mb-6 leading-relaxed text-justify">
                                {featuredNews?.meta.description || "Stay updated with the latest news and announcements from the Philippine Taekwondo Institute."}
                            </p>
                            <a
                                href={featuredNews?.meta.link || "#"}
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

            {/* News Articles Container - From Content Folder */}
            {allNews.length > 0 && (
                <div className="max-w-6xl mx-auto space-y-8 mt-20">
                    {allNews.map((news) => (
                        <div key={news.slug} className="w-full bg-white relative shadow-lg rounded-sm overflow-hidden">
                            <div className="flex items-center gap-x-6">
                                <div className="w-[35%] h-[350px]">
                                    <div className="w-full h-[350px] relative border overflow-hidden">
                                        <Image
                                            src={news.meta.image || "/images/Competition.png"}
                                            alt={news.meta.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="font-geist w-[70%]">
                                    <div className="p-6 rounded-md text-black">
                                        <h3 className="font-geist font-bold text-lg mb-2 text-[#1A1A1A]">
                                            {news.meta.title}
                                        </h3>
                                        <p className="text-sm mb-4 text-[#EAB044]">
                                            {news.meta.date}
                                        </p>
                                        <p className="font-geist text-sm mb-6 leading-relaxed text-left text-gray-700">
                                            {news.meta.description}
                                        </p>
                                        <Link
                                            href={`/news/${news.slug}`}
                                            className="text-sm font-semibold inline-flex items-center gap-2 group text-[#EAB044]"
                                        >
                                            Discover the full story
                                            <span className="text-sm transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};
