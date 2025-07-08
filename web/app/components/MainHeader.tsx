'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faSquareInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Header() {
    const pathname = usePathname();
  return (
    <header>
      {/* Main Header */}
      <div className="bg-white shadow-lg font-geist z-10 relative">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/PTI-Logo.png"
              alt="Pilipinas Taekwondo"
              width={65}
              height={65}
              className="rounded-full"
            />
          </div>

          <div className={`flex items-center gap-8 ml-auto`}>
            <nav className="flex items-center gap-8 text-black font-bold text-base uppercase">

                {/* Home */}
                <Link href="/" className="relative group">
                    <span className={`relative ${pathname === '/' ? 'font-black' : 'font-semibold'} text-black`}>
                        Home
                        {pathname === '/' ? (
                            <span className="absolute left-1/2 bottom-[-6px] w-full h-[2px] bg-[#FED018] -translate-x-1/2"></span>
                        ) : (
                            <span className="absolute left-1/2 bottom-[-6px] w-0 h-[2px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                        )}
                    </span>
                </Link>

                {/* About */}
                <Link href="/about" className="relative group">
                    <span className={`relative ${pathname === '/about' ? 'font-black' : 'font-semibold'} text-black`}>
                        About
                        {pathname === '/about' ? (
                            <span className="absolute left-1/2 bottom-[-6px] w-full h-[2px] bg-[#FED018] -translate-x-1/2"></span>
                        ) : (
                            <span className="absolute left-1/2 bottom-[-6px] w-0 h-[2px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                        )}
                    </span>
                </Link>

                {/* Competitions */}
                <Link href="/competitions" className="relative group">
                    <span className={`relative ${pathname === '/competitions' ? 'font-black' : 'font-semibold'} text-black`}>
                        Competitions
                        {pathname === '/competitions' ? (
                            <span className="absolute left-1/2 bottom-[-6px] w-full h-[2px] bg-[#FED018] -translate-x-1/2"></span>
                        ) : (
                            <span className="absolute left-1/2 bottom-[-6px] w-0 h-[2px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                        )}
                    </span>
                </Link>

                {/* News */}
                <Link href="/news" className="relative group">
                    <span className={`relative ${pathname === '/news' ? 'font-black' : 'font-semibold'} text-black`}>
                        News
                        {pathname === '/news' ? (
                            <span className="absolute left-1/2 bottom-[-6px] w-full h-[2px] bg-[#FED018] -translate-x-1/2"></span>
                        ) : (
                            <span className="absolute left-1/2 bottom-[-6px] w-0 h-[2px] bg-[#FED018] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                        )}
                    </span>
                </Link>

            {/* Sign In */}
            <Link
                href="/auth/sign-in"
                className="relative overflow-hidden group px-8 py-2.5 bg-[#1A1A1A] text-white rounded text-sm uppercase transition-all duration-300"
            >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-[#FED018] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                <span className="absolute inset-0 group-hover:text-black transition duration-300 z-10 flex items-center justify-center font-bold">
                    Sign In
                </span>
            </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}