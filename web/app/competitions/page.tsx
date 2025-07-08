import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getFirstImageFromPost } from "@/lib/posts";

export default function Competitions() {
    const posts = getAllPosts();

    return (
        <main className="px-4 sm:px-4 pt-16 pb-10 text-center">
            {/* Page Heading */}
            <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
                COMPETITIONS
            </h1>

            {/* List of Competition Posts */}
            <div className="mt-8 space-y-6">
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
                            <div className=" font-geist font-black text-xl mb-2">
                                {post.meta.title}
                            </div>
                            <div className="font-geist text-center">
                                <p className="text-[#EAB044] font-semibold text-sm">{post.meta.date}</p>

                            </div>

                            {/* Button positioned absolutely at bottom right */}
                            <Link href={`/competitions/${post.slug}`}>
                                <button className="absolute bottom-4 right-6 bg-foreground hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer">
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
                    );
                })}
            </div>
        </main>
    );
}
