import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getFirstImageFromPost, formatDate } from "@/lib/posts";

export default function Competitions() {
    const posts = getAllPosts();

    return (
        <main className="px-4 sm:px-4 pt-16 pb-10 text-center">
            {/* Page Heading */}
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

            {/* List of Competition Posts */}
            <div className="mt-8 md:mt-16 space-y-6">
                {posts.map((post) => {
                    const postImage = getFirstImageFromPost(post.slug);
                    return (
                        <div key={post.slug} className="mx-auto max-w-6xl border-2 rounded-sm border-foreground p-6 hover:shadow-lg transition-shadow relative">
                            {/* Post Image */}
                            {postImage && (
                                <div className="mb-4 overflow-hidden">
                                    <Image
                                        src={postImage}
                                        alt={post.meta.title}
                                        width={1500}
                                        height={700}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="font-geist font-black text-base md:text-xl mb-0 md:mb-2">
                                {post.meta.title}
                            </div>

                            <div className="font-geist text-center">
                                <span className="text-[#EAB044] font-semibold text-xs md:text-base">
                                    {formatDate(post.meta.date)}
                                </span>
                            </div>

                            <div className="mt-2 md:mt-0 md:absolute md:bottom-4 md:right-6 text-center md:text-right">
                                <Link href={`/competitions/${post.slug}`}>
                                    <button className="cursor-pointer bg-foreground hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 justify-center md:justify-end mx-auto md:mx-0">
                                    View Details
                                        <Image
                                            src="/icons/Forward Button.svg"
                                            alt="Forward"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
