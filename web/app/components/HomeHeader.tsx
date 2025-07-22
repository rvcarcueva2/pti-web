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

export default function HomeHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log('HomeHeader - Current user state:', user);

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('HomeHeader - Initial session check:', session);
        console.log('HomeHeader - Session error:', error);
        console.log('HomeHeader - User from session:', session?.user);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('HomeHeader - Error getting session:', err);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('HomeHeader - Auth state changed:', event);
      console.log('HomeHeader - New session:', session);
      console.log('HomeHeader - New user:', session?.user);
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
    <>
      <div className="bg-black text-white text-sm font-geist max-[1080px]:hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>pilipinastaekwondo@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} />
              <span>+63 905 815 5032</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a href="https://www.facebook.com/profile.php?id=100071547405103" target="_blank" rel="noopener noreferrer" title="Facebook">
              <Image src="/icons/Facebook.svg" alt="Facebook" width={20} height={20} className="hover:opacity-80 transition" />
            </a>
            <a href="https://www.instagram.com/pilipinas_taekwondo_inc" target="_blank" rel="noopener noreferrer" title="Instagram">
              <Image src="/icons/Instagram.svg" alt="Instagram" width={20} height={20} className="hover:opacity-80 transition" />
            </a>
            <a href="https://www.youtube.com/@pilipinastaekwondo" target="_blank" rel="noopener noreferrer" title="YouTube">
              <Image src="/icons/Youtube.svg" alt="YouTube" width={22} height={22} className="hover:opacity-80 transition" />
            </a>
          </div>
        </div>
      </div>

      <header className="absolute top-[40px] left-0 w-full z-10 font-geist">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between bg-transparent">

          <div className="flex items-center pl-40 max-[1080px]:pl-0">
            <Image
              src="/PTI-Logo.png"
              alt="Pilipinas Taekwondo"
              width={65}
              height={65}
              className="rounded-full"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8 text-black font-bold text-base uppercase max-[1080px]:hidden">
        
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

            {/* User Authentication */}
            {user ? (
                // User Profile Dropdown
                <div className="relative user-dropdown">
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

          {/* Mobile Burger Button */}
          {isClient && (
            <div className="min-[1081px]:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-black p-2"
                aria-label="Toggle mobile menu"
              >
                <FontAwesomeIcon 
                  icon={isMobileMenuOpen ? faTimes : faBars} 
                  className="w-6 h-6"
                />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu - Connected to Header */}
        {isClient && (
          <div className={`min-[1081px]:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white border-t border-gray-200 shadow-lg">
              <nav className="flex flex-col p-6 space-y-4">
              
              {/* Mobile Home */}
              <Link 
                href="/" 
                className="relative group py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`relative ${pathname === '/' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018]`}>
                  Home
                  {pathname === '/' && (
                    <span className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#FED018]"></span>
                  )}
                </span>
              </Link>

              {/* Mobile About */}
              <Link 
                href="/about" 
                className="relative group py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`relative ${pathname === '/about' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018]`}>
                  About
                  {pathname === '/about' && (
                    <span className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#FED018]"></span>
                  )}
                </span>
              </Link>

              {/* Mobile Competitions */}
              <Link 
                href="/competitions" 
                className="relative group py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`relative ${pathname === '/competitions' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018]`}>
                  Competitions
                  {pathname === '/competitions' && (
                    <span className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#FED018]"></span>
                  )}
                </span>
              </Link>

              {/* Mobile News */}
              <Link 
                href="/news" 
                className="relative group py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`relative ${pathname === '/news' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018]`}>
                  News
                  {pathname === '/news' && (
                    <span className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#FED018]"></span>
                  )}
                </span>
              </Link>

              {/* Mobile Sign In */}
              <Link
                href="/auth/sign-in"
                className="relative overflow-hidden group px-6 py-4 bg-[#1A1A1A] text-white rounded-lg text-sm uppercase transition-all duration-300 mt-6 text-center hover:bg-[#FED018] hover:text-black font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Sign In</span>
              </Link>
            </nav>
          </div>
        </div>
        )}
      </header>
    </>
  );
}
