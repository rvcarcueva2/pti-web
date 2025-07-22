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

  const isAuthPage =
    pathname === '/auth/sign-in' || pathname === '/auth/register';

  const isDashboardPage =
    pathname.startsWith('/user-dashboard') || pathname.startsWith('/admin-dashboard');

  if (isAuthPage) {
    return <ContactHeader />;
  }

  if (isDashboardPage) {
    return null; // Don't show any headers on dashboard pages
  }

  if (pathname === '/' && !isMobile) {
    return <HomeHeader />;
  }

  return (
    <>
      <ContactHeader />
      <MainHeader />
    </>
  );
}