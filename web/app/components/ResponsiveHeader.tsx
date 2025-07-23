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

  const isAuthPage = ['/auth/sign-in', '/auth/register', '/auth/forgot-password', '/auth/reset-password'].includes(pathname);
  const isDashboard = pathname.startsWith('/user-dashboard');

  if (isAuthPage || isDashboard) {
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
