import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import { getPaginatedNews, formatDate } from '@/lib/news';
import { getFeaturedNews } from '@/lib/featured';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function News() {
    const headersList = headers();
    const url = (await headersList).get('x-next-url') || '';
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const currentPage = parseInt(searchParams.get('page') ?? '1', 10);

    const paginatedData = await getPaginatedNews(currentPage, 5);
    const featuredNews = await getFeaturedNews();
    
    return (
        <main className="pt-10 md:pt-16 pb-10">
            <div className="flex justify-center items-center mb-8">
                <div className="text-center">
                    {/* h3 for mobile only */}
                    <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                        NEWS
                    </h2>

                    {/* h1 for desktop and up */}
                    <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                        NEWS
                    </h1>
                </div>
            </div>

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

            {/* News Articles Container - From Content Folder */}
            {paginatedData.news.length > 0 && (
                <div className="max-w-6xl mx-auto space-y-8 mt-20">
                    {paginatedData.news.map((news) => (
                        <div key={news.slug} className="w-full bg-white relative shadow-lg overflow-hidden pt-4 md:pt-0">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-y-1 md:gap-x-6 px-4 md:px-0">
                                <div className="w-[95%] md:w-[35%] mx-auto pt-4 md:pt-0">
                                    <div className="relative w-full aspect-[16/9] md:h-[350px] border overflow-hidden">
                                        <Image
                                            src={news.meta.image || "/images/Competition.png"}
                                            alt={news.meta.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="font-geist w-full md:w-[70%]">
                                    <div className="p-6 rounded-md text-black">
                                        <>
                                            {/* Mobile: h5 */}
                                            <h5 className="block md:hidden font-geist font-bold text-base mb-2 text-[#1A1A1A]">
                                                {news.meta.title}
                                            </h5>

                                            {/* Desktop: h3 */}
                                            <h3 className="hidden md:block font-geist font-bold text-lg mb-2 text-[#1A1A1A]">
                                                {news.meta.title}
                                            </h3>
                                        </>
                                        <p className="text-responsive text-sm mb-4 text-[#EAB044]">
                                            {formatDate(news.meta.date)}
                                        </p>
                                        <p className="text-responsive font-geist text-sm mb-6 leading-relaxed text-left text-gray-700">
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

                    {/* Pagination Controls */}
                    {paginatedData.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-12 mb-8 max-w-md mx-auto">
                            {/* Previous Button - Always present but invisible when not needed */}
                            <div className="w-24">
                                {paginatedData.hasPrevPage ? (
                                    <Link
                                        href={`/news?page=${paginatedData.currentPage - 1}`}
                                        className="px-20 py-2 rounded transition-colors duration-200 font-semibold inline-flex items-center gap-2 group text-black hover:text-[#d19a39]"
                                    >
                                        <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1">
                                            ←
                                        </span>
                                        Previous
                                    </Link>
                                ) : (
                                    <div className="w-full"></div>
                                )}
                            </div>

                            {/* Page Numbers - Fixed center position */}
                            <div className="flex space-x-2">
                                {Array.from({ length: paginatedData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <Link
                                        key={pageNum}
                                        href={`/news?page=${pageNum}`}
                                        className={`px-3 py-2 rounded font-semibold transition-colors duration-200 ${pageNum === paginatedData.currentPage
                                            ? 'bg-[#EAB044] text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                ))}
                            </div>

                            {/* Next Button - Always present but invisible when not needed */}
                            <div className="w-24 flex justify-end">
                                {paginatedData.hasNextPage ? (
                                    <Link
                                        href={`/news?page=${paginatedData.currentPage + 1}`}
                                        className="px-26 py-2 transition-colors duration-200 font-semibold group inline-flex items-center gap-2 text-black hover:text-[#d19a39]"
                                    >
                                        Next
                                        <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                                            →
                                        </span>
                                    </Link>
                                ) : (
                                    <div className="w-full"></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};