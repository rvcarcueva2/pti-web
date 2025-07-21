'use client';

import { usePathname } from 'next/navigation';
import ContactHeader from '@/app/components/ContactHeader';
import MainHeader from '@/app/components/MainHeader';
import HomeHeader from '@/app/components/HomeHeader';

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Routes that should show only the black contact header
  const contactOnlyRoutes = ['/auth/sign-in', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

  if (contactOnlyRoutes.includes(pathname)) {
    return <ContactHeader />;
  }

  if (pathname === '/') {
    return <HomeHeader />;
  }

  return (
    <>
      <ContactHeader />
      <MainHeader />
    </>
  );
}