'use client';

import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header>
      {/* Contact Header */}
      <div className="bg-black text-white text-sm font-geist max-[1080px]:hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-y-2 md:gap-y-0">

          {/* Email & Phone */}
          <div className="flex flex-wrap items-center gap-4 text-[14px] sm:text-[13px] max-[768px]:text-[12px]">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 max-[768px]:w-3 max-[768px]:h-3" />
              <span className="whitespace-nowrap">pilipinastaekwondo@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="w-4 h-4 max-[768px]:w-3 max-[768px]:h-3" />
              <span className="whitespace-nowrap">+63 905 815 5032</span>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-2 sm:gap-1">
            <a
              href="https://www.facebook.com/profile.php?id=100071547405103"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <Image
                src="/icons/Facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="hover:opacity-80 transition max-[768px]:w-[16px] max-[768px]:h-[16px]"
              />
            </a>

            <a
              href="https://www.instagram.com/pilipinas_taekwondo_inc"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <Image
                src="/icons/Instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="hover:opacity-80 transition max-[768px]:w-[16px] max-[768px]:h-[16px]"
              />
            </a>

            <a
              href="https://www.youtube.com/@pilipinastaekwondo"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
            >
              <Image
                src="/icons/Youtube.svg"
                alt="YouTube"
                width={22}
                height={22}
                className="hover:opacity-80 transition max-[768px]:w-[18px] max-[768px]:h-[18px]"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
