'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContactHeader from '@/app/components/ContactHeader';
import HomeHeader from './HomeHeader';
import MainHeader from './MainHeader';

export default function ResponsiveHeader() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authPaths = [
    '/auth/sign-in',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  const isAuthPage = authPaths.includes(pathname);

  const isDashboardPage =
    pathname.startsWith('/admin-panel');

  if (isAuthPage) {
    return <ContactHeader />;
  }

  if (isDashboardPage) {
    return null;
  }

  // Use CSS classes instead of JavaScript for responsive behavior
  if (pathname === '/') {
    return (
      <div>
        <div className="hidden xl:block">
          <HomeHeader />
        </div>
        <div className="block xl:hidden">
          <ContactHeader />
          <MainHeader />
        </div>
      </div>
    );
  }

  if (pathname.startsWith('/registration')) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <ContactHeader />
        <MainHeader />
      </div>
    );
  }

  if (pathname.startsWith('/players')) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <ContactHeader />
        <MainHeader />
      </div>
    );
  }

  return (
    <>
      <ContactHeader />
      <MainHeader />
    </>
  );
}