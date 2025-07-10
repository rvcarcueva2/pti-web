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

    // Custom MDX components for news styling
    const components = {
        img: (props: any) => (
            <Image
                src={props.src}
                alt={props.alt || 'News Image'}
                width={1500}
                height={700}
                className="w-full h-auto mx-auto my-8 rounded-lg"
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
        <main className="px-4 sm:px-4 pt-16 pb-10">

            {/* Two-column layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <div className="font-geist">
                        {/* Featured Image */}
                        {news.meta.image && (
                            <div className="mb-8">
                                <Image
                                    src={news.meta.image}
                                    alt={news.meta.title}
                                    width={1200}
                                    height={600}
                                    className="w-full h-[600px] object-cover shadow-lg"
                                />
                            </div>
                            
                        )}
                        <h2 className="font-geist font-bold text-2xl mb-4">{news.meta.title}</h2>
                        <p className="text-sm  text-gray-400 mb-6">{formatDate(news.meta.date)}</p>

                        <div className="max-w-none prose prose-lg mx-auto">
                            <MDXRemote source={news.content} components={components} />
                        </div>

                        {/* Back to News Link */}
                        <div className="mt-8 pt-8 ">
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

                {/* Recent News Sidebar */}
                <div className="lg:col-span-1">
                    <div className=" top-8 border-l-1 border-gray-300 pl-6" >
                        <h3 className="text-xl font-bold mb-6 text-center lg:text-left">Recent News</h3>
                        
                        {recentNews.length > 0 ? (
                            <div className="space-y-4">
                                {recentNews.map((recentNewsItem) => (
                                    <div key={recentNewsItem.slug} className="group mb-8">
                                        {recentNewsItem.meta.image && (
                                            <div className="mb-3">
                                                <Image
                                                    src={recentNewsItem.meta.image}
                                                    alt={recentNewsItem.meta.title}
                                                    width={400}
                                                    height={300}
                                                    className="w-full h-[300px] object-cover "
                                                />
                                            </div>
                                        )}
                                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                            {recentNewsItem.meta.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {formatDate(recentNewsItem.meta.date)}
                                        </p>
                                        <Link 
                                            href={`/news/${recentNewsItem.slug}`}
                                            className="inline-flex items-center text-[#EAB044] hover:text-[#D4A73C] transition-colors duration-200 text-xs group font-semibold"
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
                            <p className="text-gray-600 text-center lg:text-left">No other news articles available.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
