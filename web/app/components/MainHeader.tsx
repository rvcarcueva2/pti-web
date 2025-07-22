'use client';


import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faUser, faChevronDown, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faSquareInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    console.log('MainHeader - Current user state:', user);

    useEffect(() => {
        // Check if user is already signed in
        const checkUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log('MainHeader - Initial session check:', session);
                console.log('MainHeader - Session error:', error);
                console.log('MainHeader - User from session:', session?.user);
                setUser(session?.user ?? null);
            } catch (err) {
                console.error('MainHeader - Error getting session:', err);
            }
        };

        checkUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('MainHeader - Auth state changed:', event);
            console.log('MainHeader - New session:', session);
            console.log('MainHeader - New user:', session?.user);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
        router.push('/');
    };
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

            {/* Authentication Section */}
            {user ? (
                // User Dropdown
                <div className="relative user-dropdown ">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white rounded text-sm uppercase transition-all duration-300 hover:bg-[#FED018] hover:text-black cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <div className="py-2">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Sign In Button
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
            )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}