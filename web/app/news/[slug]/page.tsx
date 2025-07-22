import { getNewsBySlug, getNewsSlugs, getRecentNews, formatDate } from '@/lib/news';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    params: { slug: string };
};

export async function generateStaticParams() {
    const slugs = getNewsSlugs();
    return slugs.map(slug => ({ slug: slug.replace(/\.mdx$/, '') }));
}

export default async function NewsPost({ params }: Props) {
    const { slug } = await params;
    const news = getNewsBySlug(slug);
    const recentNews = getRecentNews(slug, 5);

    if (!news) return notFound();

    const components = {
        img: (props: any) => (
            <Image
                src={props.src}
                alt={props.alt || 'News Image'}
                width={1500}
                height={700}
                className="w-full h-auto mx-auto my-8"
            />
        ),
        p: ({ children, ...props }: any) => {
            if (
                children &&
                typeof children === 'object' &&
                (children.type === 'img' ||
                    (Array.isArray(children) && children.some((child: any) => child?.type === 'img')))
            ) {
                return <>{children}</>;
            }
            return <p className="my-4" {...props}>{children}</p>;
        },
    };

    return (
        <main className="px-6 sm:px-8 pt-16 pb-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="font-geist">
                        {news.meta.image && (
                            <div className="mb-4">
                                <Image
                                    src={news.meta.image}
                                    alt={news.meta.title}
                                    width={1200}
                                    height={600}
                                    className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] object-cover shadow-lg"
                                />
                            </div>
                        )}

                        <>
                            {/* Mobile h4 */}
                            <h4 className="block md:hidden font-geist font-bold text-base mb-1">
                                {news.meta.title}
                            </h4>

                            {/* Desktop h2 */}
                            <h2 className="hidden md:block font-geist font-bold text-2xl mb-1">
                                {news.meta.title}
                            </h2>
                        </>

                        {news.meta.date && (
                            <p className="text-sm text-gray-400 mb-6">{formatDate(news.meta.date)}</p>
                        )}

                        <div className="text-responsive max-w-none prose prose-lg mx-auto">
                            <MDXRemote source={news.content} components={components} />
                        </div>

                        {/* Back to News Link */}
                        <div className="mt-4 pt-2 mb-10">
                            <Link
                                href="/news"
                                className="inline-flex items-center text-[#EAB044] hover:text-[#D4A73C] transition-colors duration-200 group font-semibold"
                            >
                                <span className="mr-1 transition-transform duration-200 group-hover:-translate-x-0.5">
                                    ←
                                </span>
                                Back to All News
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="top-8 border-l-0 lg:border-l lg:border-gray-300 lg:pl-6">
                        <h3 className="font-geist text-xl font-bold mb-6 text-center lg:text-left">Recent News</h3>

                        {recentNews.length > 0 ? (
                            <div className="space-y-4">
                                {recentNews.map((recentNewsItem) => (
                                    <div key={recentNewsItem.slug} className="group mb-8">
                                        {recentNewsItem.meta.image && (
                                            <div className="mb-3">
                                                {/* 16:9 aspect ratio for mobile, fixed height for md and up */}
                                                <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[300px]">
                                                    <Image
                                                    src={recentNewsItem.meta.image}
                                                    alt={recentNewsItem.meta.title}
                                                    fill
                                                    className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <>
                                            {/* Mobile h5 */}
                                            <h5 className="block md:hidden font-geist font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                {recentNewsItem.meta.title}
                                            </h5>

                                            {/* Desktop h4 */}
                                            <h4 className="hidden md:block font-geist font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                {recentNewsItem.meta.title}
                                            </h4>
                                        </>

                                        <p className="font-geist text-xs text-gray-400 mb-2">
                                            {formatDate(recentNewsItem.meta.date)}
                                        </p>
                                        <Link
                                            href={`/news/${recentNewsItem.slug}`}
                                            className="font-geist inline-flex items-center text-[#EAB044] hover:text-[#D4A73C] transition-colors duration-200 text-xs group font-semibold"
                                        >
                                            Discover the full story
                                            <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center lg:text-left">No recent news articles available.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
