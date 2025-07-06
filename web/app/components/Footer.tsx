"use client";

import { useEffect, useState } from 'react';
import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";


const Footer = () => {

    return (
        <footer className="bg-white mt-10">
            <div className="text-black max-w-7xl mx-auto px-4 grid grid-flow-row md:grid-flow-col auto-cols-auto gap-8 text-sm py-10 overflow-hidden">


                <div className=" font-geist">
                    <div className="flex items-center">
                        <Image
                            src="/PTI-Logo.png"
                            alt="Pilipinas Taekwondo"
                            width={136}
                            height={136}
                            className="rounded-full"
                        />
                    </div>
                </div>


                <div className=" font-geist col-span-2">


                    <h4 className="mb-4 text-sm text-gray-800">
                        Get in touch with us and stay updated.
                    </h4>


                    <form className="flex items-center border border-gray-300 bg-gray-100 rounded w-full">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-4 py-2 text-sm text-gray-800 bg-transparent outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 text-[#FED018] hover:text-[#EAB044] cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faCircleChevronRight} className="w-5 h-5" />
                        </button>
                    </form>

                </div>


                <div className="font-geist flex flex-col items-center">
                    <ul className="text-[18px] font-semibold space-y-2">
                        <li>
                            <Link href="/" className="relative group">
                                <span className="relative transition">
                                    Home
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="relative group">
                                <span className="relative transition">
                                    About
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/competitions" className="relative group">
                                <span className="relative transition">
                                    Competitions
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/news" className="relative group">
                                <span className="relative transition">
                                    News
                                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2.5px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>


                <div className="font-geist flex flex-col items-center mr-5">
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    {/* Social Media */}
                    <div className="flex items-center gap-1">
                        <a
                            href="https://www.facebook.com/profile.php?id=100071547405103"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/icons/Facebook-bg.svg"
                                alt="Facebook"
                                width={26}
                                height={26}
                                className="hover:opacity-80 transition"
                            />
                        </a>

                        <a
                            href="https://www.instagram.com/pilipinas_taekwondo_inc"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/icons/Instagram-bg.svg"
                                alt="Instagram"
                                width={26}
                                height={26}
                                className="hover:opacity-80 transition"
                            />
                        </a>

                        <a
                            href="https://www.youtube.com/@pilipinastaekwondo"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/icons/Youtube-bg.svg"
                                alt="YouTube"
                                width={26}
                                height={26}
                                className="hover:opacity-80 transition"
                            />
                        </a>
                    </div>
                </div>


                <div className="font-geist ">
                    <h4 className="font-semibold mb-3">Follow Us</h4>

                    <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                        <a
                            href="mailto:pilipinastaekwondo@gmail.com"
                            className="hover:underline text-sm text-gray-800"
                        >
                            pilipinastaekwondo@gmail.com
                        </a>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                        <span>+63 905 815 5032</span>
                    </div>
                </div>


            </div>

            <div className='bg-foreground text-white mt-8 md:mt-10 text-center text-sm font-light py-2 md:py-4 font-geist '>
                <div><p>© Copyright 2025  Pilipinas Taekwondo Incorporated. All Rights Reserved </p> </div>

            </div>
        </footer>
    );
};
export default Footer;