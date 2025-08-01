'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone, faUser, faChevronDown, faSignOutAlt, faBookmark, faChartSimple, faPenNib  } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function HomeHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);

          const userRole = session.user?.user_metadata?.role || session.user?.app_metadata?.role || null;
          setRole(userRole);

          const firstName = session.user.user_metadata?.firstName ||
            session.user.user_metadata?.first_name ||
            session.user.email?.split('@')[0] ||
            'User';
          setUserFirstName(firstName);
        } else {
          setUser(null);
          setUserFirstName('');
          setRole(null);
        }
      } catch (err) {
        console.error('Error getting session:', err);
        setUser(null);
        setUserFirstName('');
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);

        const userRole = session.user?.user_metadata?.role || session.user?.app_metadata?.role || null;
        setRole(userRole);

        const firstName = session.user.user_metadata?.firstName ||
          session.user.user_metadata?.first_name ||
          session.user.email?.split('@')[0] ||
          'User';
        setUserFirstName(firstName);
      } else {
        setUser(null);
        setUserFirstName('');
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      <div className="bg-black text-white text-sm font-geist">
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
            <a href="https://www.facebook.com/profile.php?id=100071547405103" target="_blank" rel="noopener noreferrer">
              <Image src="/icons/Facebook.svg" alt="Facebook" width={20} height={20} className="hover:opacity-80 transition" />
            </a>
            <a href="https://www.instagram.com/pilipinas_taekwondo_inc" target="_blank" rel="noopener noreferrer">
              <Image src="/icons/Instagram.svg" alt="Instagram" width={20} height={20} className="hover:opacity-80 transition" />
            </a>
            <a href="https://www.youtube.com/@pilipinastaekwondo" target="_blank" rel="noopener noreferrer">
              <Image src="/icons/Youtube.svg" alt="YouTube" width={22} height={22} className="hover:opacity-80 transition" />
            </a>
          </div>
        </div>
      </div>

      <header className="absolute top-[40px] left-0 w-full z-10 font-geist">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between bg-transparent">

          <div className="flex items-center pl-40">
            <Image
              src="/PTI-Logo.png"
              alt="Pilipinas Taekwondo"
              width={65}
              height={65}
              className="rounded-full"
            />
          </div>

          <nav className="flex items-center gap-8 text-black font-bold text-base uppercase">
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

            {!isLoading && user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white rounded text-sm uppercase transition-all duration-300 hover:bg-[#FED018] hover:text-black cursor-pointer"
                >
                  <span className="text-sm">{userFirstName}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {role === 'Admin' && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            router.push('/admin-panel/dashboard');
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faChartSimple} className="w-4 h-4 mr-2" />
                          Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/my-team');
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faBookmark} className="w-4 h-4 mr-2" />
                        My Team
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/registration');
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPenNib} className="w-4 h-4 mr-2" />
                        Registration
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/profile');
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoading ? (
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
            ) : null}
          </nav>
        </div>
      </header>
    </>
  );
}
