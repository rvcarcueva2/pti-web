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
                className="w-full h-auto mx-auto my-4 mb-1 md:my-8"
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
        <main className="px-4 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
            <div className="text-center">
                {/* h3 for mobile only */}
                <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                    COMPETITIONS
                </h2>

                {/* h1 for desktop and up */}
                <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                    COMPETITIONS
                </h1>
            </div>

            {/* Competition Post Container */}
            <div className="font-geist mx-auto my-4 md:my-8 max-w-6xl">
                <div className="max-w-none">
                    <>
                        {/* h4 for mobile */}
                        <h4 className="block md:hidden text-xl font-bold mb-4 text-center">
                            {post.meta.title}
                        </h4>

                        {/* h2 for desktop */}
                        <h2 className="hidden md:block text-2xl font-bold mb-4 text-center">
                            {post.meta.title}
                        </h2>
                    </>

                    {/* Render MDX content */}
                    <div className="max-w-none">
                        <MDXRemote source={post.content} components={components} />
                    </div>

                    {/* Competition Meta Info (SAFE from hydration issues) */}
                    <div className="p-4 mx-auto max-w-6xl mt-2 md:mt-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                                <button className="group bg-foreground hover:bg-[#EAB044] text-white font-semibold py-2 px-6 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer h-11">
                                    Register

                                    {/* Default icon (visible when not hovered) */}
                                    <Image
                                    src="/icons/Forward Button.svg"
                                    alt="Forward"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 group-hover:hidden"
                                    />

                                    {/* Hover icon (visible when hovered) */}
                                    <Image
                                    src="/icons/forward-button2.svg"
                                    alt="Forward Hover"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 hidden group-hover:inline"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Competition Categories */}
                    <div className="bg-white rounded-lg p-2 md:p-4 mt-4 md:mt-6 max-w-6xl mx-4 md:mx-auto shadow-sm">
                        <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                            <div className="flex flex-col items-center gap-1 md:gap-2">
                                <h4 className="text-responsive font-semibold text-black text-xs md:text-lg">Players</h4>
                                <Image
                                src="/icons/Players.svg"
                                alt="Players"
                                width={72}
                                height={72}
                                className="w-7 h-7 md:w-18 md:h-18 items-center justify-center mx-auto"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-1 md:gap-2">
                                <h4 className="text-responsive font-semibold text-[#EAB044] text-xs md:text-lg">Teams</h4>
                                <Image
                                src="/icons/Teams.svg"
                                alt="Teams"
                                width={72}
                                height={72}
                                className="w-7 h-7 md:w-18 md:h-18 items-center justify-center mx-auto"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-1 md:gap-2">
                                <h4 className="text-responsive font-semibold text-[#D41716] text-xs md:text-lg">Kyorugi</h4>
                                <Image
                                src="/icons/Kyorugi.svg"
                                alt="Kyorugi"
                                width={72}
                                height={72}
                                className="w-7 h-7 md:w-18 md:h-18 items-center justify-center mx-auto"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-1 md:gap-2">
                                <h4 className="text-responsive font-semibold text-[#040163] text-xs md:text-lg">Poomsae</h4>
                                <Image
                                src="/icons/Poomsae.svg"
                                alt="Poomsae"
                                width={72}
                                height={72}
                                className="w-7 h-7 md:w-18 md:h-18 items-center justify-center mx-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
