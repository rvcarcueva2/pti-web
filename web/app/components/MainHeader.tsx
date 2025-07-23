'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Geist } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faBars, faTimes, faUser, faSignOutAlt, faChevronDown, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faSquareInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userFirstName, setUserFirstName] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get current session and user profile
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    
                    // Get first name from user metadata or fallback
                    const firstName = session.user.user_metadata?.firstName || 
                                    session.user.user_metadata?.first_name || 
                                    session.user.email?.split('@')[0] || 
                                    'User';
                    setUserFirstName(firstName);
                } else {
                    setUser(null);
                    setUserFirstName('');
                }
            } catch (error) {
                console.error('Error getting session:', error);
                setUser(null);
                setUserFirstName('');
            } finally {
                setIsLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    
                    // Get first name from user metadata or fallback
                    const firstName = session.user.user_metadata?.firstName || 
                                    session.user.user_metadata?.first_name || 
                                    session.user.email?.split('@')[0] || 
                                    'User';
                    setUserFirstName(firstName);
                } else {
                    setUser(null);
                    setUserFirstName('');
                }
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
                            className="rounded-full w-[65px] h-[65px] max-[1080px]:w-[45px] max-[1080px]:h-[45px]"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className={`flex items-center gap-8 ml-auto max-[1080px]:hidden`}>
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

                            {/* Authentication */}
                            {!isLoading && user ? (
                                <div className="relative user-dropdown">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white rounded text-sm uppercase transition-all duration-300 hover:bg-[#FED018] hover:text-black cursor-pointer"
                                    >
                                        <span className="text-sm">
                                            {userFirstName}
                                        </span>
                                        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        router.push('/user-dashboard/my-team');
                                                    }}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faBookmark} className="w-4 h-4 mr-2" />
                                                    My Team
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

                    {/* Mobile Burger Button */}
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
                </div>

                {/* Mobile Navigation Menu - Connected to Header */}
                <div className={`min-[1081px]:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white border-t border-gray-200 shadow-lg">
                        <nav className="flex flex-col p-6 space-y-4">

                            {/* Mobile Home */}
                            <Link
                                href="/"
                                className="relative group py-2 -mt-4 border-b border-gray-100 last:border-b-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className={`relative ${pathname === '/' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018] text-responsive`}>
                                    Home
                                    {pathname === '/' && (
                                        <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-[#FED018]"></span>
                                    )}
                                </span>
                            </Link>

                            {/* Mobile About */}
                            <Link
                                href="/about"
                                className="relative group py-2 -mt-4 border-b border-gray-100 last:border-b-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className={`relative ${pathname === '/about' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018] text-responsive`}>
                                    About
                                    {pathname === '/about' && (
                                        <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-[#FED018]"></span>
                                    )}
                                </span>
                            </Link>

                            {/* Mobile Competitions */}
                            <Link
                                href="/competitions"
                                className="relative group py-2 -mt-4 border-b border-gray-100 last:border-b-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className={`relative ${pathname === '/competitions' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018] text-responsive`}>
                                    Competitions
                                    {pathname === '/competitions' && (
                                        <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-[#FED018]"></span>
                                    )}
                                </span>
                            </Link>

                            {/* Mobile News */}
                            <Link
                                href="/news"
                                className="relative group py-2 -mt-4 border-b border-gray-100 last:border-b-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className={`relative ${pathname === '/news' ? 'font-black text-[#FED018]' : 'font-semibold'} text-black uppercase text-lg transition-colors duration-200 hover:text-[#FED018] text-responsive`}>
                                    News
                                    {pathname === '/news' && (
                                        <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-[#FED018]"></span>
                                    )}
                                </span>
                            </Link>

                            {/* Mobile Authentication */}
                            {!isLoading && user ? (
                                <div className="space-y-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            router.push('/user-dashboard/my-team');
                                        }}
                                        className="flex items-center w-full px-6 py-3 bg-[#FED018] text-black rounded-lg text-sm uppercase transition-all duration-300 text-left cursor-pointer hover:bg-[#FED018]/90"
                                    >
                                        <FontAwesomeIcon icon={faBookmark} className="w-4 h-4 mr-2" />
                                        My Team
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            router.push('/profile');
                                        }}
                                        className="flex items-center w-full px-6 py-3 bg-gray-200 text-black rounded-lg text-sm uppercase transition-all duration-300 text-left cursor-pointer hover:bg-gray-200"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center w-full px-6 py-3 bg-[#1A1A1A] text-white rounded-lg text-sm uppercase transition-all duration-300 text-left cursor-pointer hover:bg-red-200"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : !isLoading ? (
                                <Link
                                    href="/auth/sign-in"
                                    className="relative overflow-hidden group px-6 py-4 bg-[#1A1A1A] text-white rounded-lg text-sm uppercase transition-all duration-300 mt-4 text-center hover:bg-[#FED018] hover:text-black font-bold text-responsive"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="relative z-10">Sign In</span>
                                </Link>
                            ) : null}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}