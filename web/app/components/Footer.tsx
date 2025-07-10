"use client";

import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";


const Footer = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle email subscription
    };

    return (
        <footer className="bg-white mt-10 max-[1024px]:mt-8 max-[768px]:mt-6">
            <div className="text-black max-w-7xl mx-auto px-4 grid grid-flow-row md:grid-flow-col auto-cols-auto gap-8 text-sm py-10 overflow-hidden max-[1490px]:gap-6 max-[1280px]:gap-4 max-[1024px]:py-8 max-[1024px]:gap-6 max-[768px]:py-6 max-[768px]:gap-4">


                <div className="font-geist max-[768px]:flex max-[768px]:justify-center">
                    <div className="flex items-center max-[768px]:justify-center">
                        <Image
                            src="/PTI-Logo.png"
                            alt="Pilipinas Taekwondo"
                            width={136}
                            height={136}
                            className="rounded-full max-[1280px]:w-[120px] max-[1280px]:h-[120px] max-[1024px]:w-[100px] max-[1024px]:h-[100px] max-[768px]:w-[80px] max-[768px]:h-[80px]"
                        />
                    </div>
                </div>


                <div className="font-geist col-span-2 max-[1024px]:col-span-1 max-[768px]:text-center">

                    <h4 className="mb-4 text-sm text-gray-800 max-[768px]:mb-3 text-responsive">
                        Get in touch with us and stay updated.
                    </h4>

                    <form className="flex items-center border border-gray-300 bg-gray-100 rounded w-full max-[768px]:max-w-sm max-[768px]:mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-4 py-2 text-sm text-gray-800 bg-transparent outline-none max-[1280px]:px-3 max-[1280px]:py-1.5 max-[768px]:px-2"
                        />
                        <button
                            type="submit"
                            className="px-4 text-[#FED018] hover:text-[#EAB044] cursor-pointer max-[1280px]:px-3 max-[768px]:px-2"
                        >
                            <FontAwesomeIcon icon={faCircleChevronRight} className="w-5 h-5 max-[1280px]:w-4 max-[1280px]:h-4 max-[768px]:w-3 max-[768px]:h-3" />
                        </button>
                    </form>

                </div>


                <div className="font-geist flex flex-col items-center max-[768px]:items-center">
                    <ul className="text-[18px] font-semibold space-y-2 max-[1024px]:space-y-1.5 max-[768px]:space-y-1 max-[768px]:text-center text-responsive">
                        <li>
                            <Link href="/" className="relative group">
                                <span className="relative transition">
                                    Home
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2 max-[768px]:h-[2px]"></span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="relative group">
                                <span className="relative transition">
                                    About
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2 max-[768px]:h-[2px]"></span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/competitions" className="relative group">
                                <span className="relative transition">
                                    Competitions
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2 max-[768px]:h-[2px]"></span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/news" className="relative group">
                                <span className="relative transition">
                                    News
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2 max-[768px]:h-[2px]"></span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>


                <div className="font-geist flex flex-col items-center mr-5 max-[1024px]:mr-3 max-[768px]:mr-0">
                    <h4 className="font-semibold mb-3 max-[1024px]:mb-2 max-[768px]:mb-2 text-responsive">Follow Us</h4>
                    {/* Social Media */}
                    <div className="flex items-center gap-1 max-[768px]:gap-0.5">
                        <a
                            href="https://www.facebook.com/profile.php?id=100071547405103"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Follow us on Facebook"
                        >
                            <Image
                                src="/icons/Facebook-bg.svg"
                                alt="Facebook"
                                width={26}
                                height={26}
                                className="hover:opacity-80 transition border-0 rounded-sm max-[1280px]:w-6 max-[1280px]:h-6 max-[1024px]:w-5 max-[1024px]:h-5 max-[768px]:w-4 max-[768px]:h-4"
                            />
                        </a>

                        <a
                            href="https://www.instagram.com/pilipinas_taekwondo_inc"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Follow us on Instagram"
                        >
                            <Image
                                src="/icons/Instagram-bg.svg"
                                alt="Instagram"
                                width={26}
                                height={26}
                                className="hover:opacity-80 transition rounded-sm max-[1280px]:w-6 max-[1280px]:h-6 max-[1024px]:w-5 max-[1024px]:h-5 max-[768px]:w-4 max-[768px]:h-4"
                            />
                        </a>

                        <a
                            href="https://www.youtube.com/@pilipinastaekwondo"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Follow us on YouTube"
                        >
                            <Image
                                src="/icons/Youtube-bg.svg"
                                alt="YouTube"
                                width={26}
                                height={26}
                                className="hover:opacity-80 transition rounded-sm max-[1280px]:w-6 max-[1280px]:h-6 max-[1024px]:w-5 max-[1024px]:h-5 max-[768px]:w-4 max-[768px]:h-4"
                            />
                        </a>
                    </div>
                </div>


                <div className="font-geist max-[768px]:text-center">
                    <h4 className="font-semibold mb-3 max-[1024px]:mb-2 max-[768px]:mb-2 text-responsive">Contact Us</h4>

                    <div className="flex items-center gap-2 mb-2 max-[1024px]:gap-1.5 max-[1024px]:mb-1.5 max-[768px]:justify-center max-[768px]:mb-1">
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 max-[1280px]:w-3 max-[1280px]:h-3 max-[768px]:w-2.5 max-[768px]:h-2.5" />
                        <a
                            href="mailto:pilipinastaekwondo@gmail.com"
                            className="hover:underline text-sm text-gray-800"
                        >
                            pilipinastaekwondo@gmail.com
                        </a>
                    </div>

                    <div className="flex items-center gap-2 mb-2 max-[1024px]:gap-1.5 max-[1024px]:mb-1.5 max-[768px]:justify-center max-[768px]:mb-1">
                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4 max-[1280px]:w-3 max-[1280px]:h-3 max-[768px]:w-2.5 max-[768px]:h-2.5" />
                        <span className="text-sm text-responsive">+63 905 815 5032</span>
                    </div>
                </div>


            </div>

            <div className='bg-foreground text-white mt-8 md:mt-10 text-center text-sm font-light py-2 md:py-4 font-geist max-[1024px]:py-1 max-[1024px]:mt-3 max-[1024px]:text-[10px] max-[768px]:py-0.5 max-[768px]:mt-2 max-[768px]:text-[8px]'>
                <div><p className="max-[1024px]:px-2 max-[768px]:px-1 max-[768px]:leading-none text-responsive">© Copyright 2025  Pilipinas Taekwondo Incorporated. All Rights Reserved </p> </div>

            </div>
        </footer>
    );
};
export default Footer;