import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Props = {
    params: { slug: string };
};

export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map(slug => ({ slug: slug.replace(/\.mdx$/, '') }));
}

export default async function CompetitionPost({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) return notFound();

    // Custom MDX components to match competition page styling
    const components = {
        img: (props: any) => (
            <Image
                src={props.src}
                alt={props.alt || 'Competition Image'}
                width={1514}
                height={757}
                className="w-full h-auto mx-auto my-8"
            />
        ),
        p: ({ children, ...props }: any) => {
            // Check if the paragraph contains only an image
            if (
                children &&
                typeof children === 'object' &&
                children.type === 'img'
            ) {
                // Render image wrapper div instead of paragraph
                return (
                    <div className="mx-auto my-8 max-w-6xl overflow-x-auto">
                        {children}
                    </div>
                );
            }
            // Regular paragraph
            return <p {...props}>{children}</p>;
        },
    };

    return (
        <>
            <main className="px-4 sm:px-4 pt-16 pb-10 text-center">
                <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
                    COMPETITIONS
                </h1>
                
                {/* Competition Post Container */}
                <div className="font-geist mx-auto my-8 max-w-6xl">
                    <div className="max-w-none">
                        <h2 className="text-2xl font-bold mb-4 text-center">{post.meta.title}</h2>
                        <p className="text-sm font-semibold text-[#EAB044] mb-6 text-center">{post.meta.date}</p>
                        <div className="max-w-none">
                            <MDXRemote source={post.content} components={components} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
