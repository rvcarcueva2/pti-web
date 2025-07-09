import { getNewsBySlug, getNewsSlugs } from '@/lib/news';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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
            <div className="flex justify-center items-center mb-8">
                <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
                    NEWS
                </h1>
            </div>

            {/* News Post Container */}
            <div className="font-geist mx-auto my-8 max-w-6xl">
                <div className="max-w-none">
                    <h2 className="text-2xl font-bold mb-4 text-center">{news.meta.title}</h2>
                    <p className="text-sm font-semibold text-[#EAB044] mb-6 text-center">{news.meta.date}</p>
                    
                    {/* Featured Image */}
                    {news.meta.image && (
                        <div className="mb-8">
                            <Image
                                src={news.meta.image}
                                alt={news.meta.title}
                                width={1200}
                                height={600}
                                className="w-full h-auto mx-auto rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    <div className="max-w-none prose prose-lg mx-auto">
                        <MDXRemote source={news.content} components={components} />
                    </div>
                </div>
            </div>
        </main>
    );
}
