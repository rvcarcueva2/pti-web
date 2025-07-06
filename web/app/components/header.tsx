'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faSquareInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header>

      {/* Contact Header */}
      <div className={`bg-black text-white text-sm font-geist`}>
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">

          {/* Email & Phone */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope}  className="w-4 h-4" />
              <span>pilipinastaekwondo@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
              <span>+63 900 000 0000</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-1">
            <a href="https://www.facebook.com/profile.php?id=100071547405103">
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a
              href="https://www.instagram.com/pilipinas_taekwondo_inc"
            >
              <FontAwesomeIcon icon={faSquareInstagram} size="lg" />
            </a>
            <a
              href="https://www.youtube.com/@pilipinastaekwondo"
            >
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white shadow font-geist`}>
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/PTI-Logo.png"
              alt="Pilipinas Taekwondo"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>

          <div className={`flex items-center gap-8 ml-auto`}>
            <nav className="flex items-center gap-8 text-black font-bold text-sm uppercase">
                <Link href="/" className="relative font-black text-black">
                    <span className="relative after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:w-[120%] after:h-[2px] after:bg-[#FED018] after:-translate-x-1/2">
                        Home
                    </span>
                </Link>
                <Link href="/about" className="hover:font-black">About</Link>
                <Link href="/events" className="hover:font-black">Competitions</Link>
                <Link href="/news" className="hover:font-black">News</Link>
                <Link href="/contact" className="hover:font-black">Contact</Link>
            </nav>

            <Link
              href="/login"
              className="bg-black text-white px-6 py-2 rounded hover:opacity-90 transition text-sm uppercase font-bold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}