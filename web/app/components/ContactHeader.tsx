'use client';

import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from 'next/navigation';


export default function Header() {
    const pathname = usePathname();
  return (
    <header>

      {/* Contact Header */}
      <div className="hidden lg:block bg-black text-white text-sm font-geist">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">

          {/* Email & Phone */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope}/>
              <span>pilipinastaekwondo@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone}/>
              <span>+63 905 815 5032</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-1">
            <a
                href="https://www.facebook.com/profile.php?id=100071547405103"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src="/icons/Facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="hover:opacity-80 transition"
                />
            </a>

            <a
                href="https://www.instagram.com/pilipinas_taekwondo_inc"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src="/icons/Instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="hover:opacity-80 transition"
                />
            </a>

            <a
                href="https://www.youtube.com/@pilipinastaekwondo"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src="/icons/Youtube.svg"
                    alt="YouTube"
                    width={22}
                    height={22}
                    className="hover:opacity-80 transition"
                />
            </a>
            </div>
        </div>
      </div>
    </header>
  );
}