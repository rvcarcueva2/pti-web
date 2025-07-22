'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContactHeader from '@/app/components/ContactHeader';
import HomeHeader from './HomeHeader';
import MainHeader from './MainHeader';

export default function ResponsiveHeader() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1080);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isAuthPage = pathname === '/auth/sign-in' || 
                    pathname === '/auth/register' || 
                    pathname === '/auth/forgot-password' || 
                    pathname === '/auth/reset-password';

  if (isAuthPage) {
    // Don't show any header on auth pages
    return null;
  }

  // Home page on desktop
  if (pathname === '/' && !isMobile) {
    return <HomeHeader />;
  }

  // Default: Contact + Main header
  return (
    <>
      <ContactHeader />
      <MainHeader />
    </>
  );
}
