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

  const authPaths = [
    '/auth/sign-in',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  const isAuthPage = authPaths.includes(pathname);

  const isDashboardPage =
    pathname.startsWith('/user-dashboard') || pathname.startsWith('/admin-dashboard');

  if (isAuthPage) {
    return <ContactHeader />;
  }

  if (isDashboardPage) {
    return null;
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