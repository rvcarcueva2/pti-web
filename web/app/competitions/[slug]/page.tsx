import { getPostBySlug, getPostSlugs, formatDate } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            return <p {...props}>{children}</p>;
        },
    };

    return (
        <main className="px-4 sm:px-4 pt-16 pb-10 text-center">
            <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
                COMPETITIONS
            </h1>

            {/* Competition Post Container */}
            <div className="font-geist mx-auto my-8 max-w-6xl">
                <div className="max-w-none">
                    <h2 className="text-2xl font-bold mb-4 text-center">{post.meta.title}</h2>

                    {/* Render MDX content */}
                    <div className="max-w-none">
                        <MDXRemote source={post.content} components={components} />
                    </div>

                    {/* Competition Meta Info (SAFE from hydration issues) */}
                    <div className="p-4 mx-auto max-w-6xl mt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col text-black gap-4 text-left font-geist text-x">
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon="location-dot" style={{ fontSize: '20px' }} />
                                    {post.meta.location || 'TBA'}
                                </span>
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon="calendar-days" style={{ fontSize: '20px' }} />
                                    {formatDate(post.meta.date) || 'TBA'}
                                </span>
                            </div>
                            <div>
                                <button className="bg-foreground hover:bg-[#EAB044] text-white font-semibold py-2 px-6 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer h-11">
                                    Register
                                    <Image
                                        src="/icons/Forward Button.svg"
                                        alt="Forward"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 ml-2"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Competition Categories */}
                    <div className="bg-white rounded-lg p-4 mt-8 max-w-6xl mx-auto shadow-sm">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <h4 className="font-semibold text-black">Players</h4>
                                <Image
                                    src="/icons/Players.svg"
                                    alt="Players"
                                    width={40}
                                    height={40}
                                    className="w-18 h-18 items-center justify-center mx-auto"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h4 className="font-semibold text-[#EAB044]">Teams</h4>
                                <Image
                                    src="/icons/Teams.svg"
                                    alt="Teams"
                                    width={40}
                                    height={40}
                                    className="w-18 h-18 items-center justify-center mx-auto"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h4 className="font-semibold text-[#D41716]">Kyorugi</h4>
                                <Image
                                    src="/icons/Kyorugi.svg"
                                    alt="Kyorugi"
                                    width={40}
                                    height={40}
                                    className="w-18 h-18 items-center justify-center mx-auto"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h4 className="font-semibold text-[#040163]">Poomsae</h4>
                                <Image
                                    src="/icons/Poomsae.svg"
                                    alt="Poomsae"
                                    width={40}
                                    height={40}
                                    className="w-18 h-18 items-center justify-center mx-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
