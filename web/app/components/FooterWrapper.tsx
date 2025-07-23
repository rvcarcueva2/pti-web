'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/app/components/Footer';

const FooterWrapper = () => {
  const pathname = usePathname();

  // Hide footer on these paths
  const hideFooterOn = ['/auth/sign-in', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const isDashboard = pathname.startsWith('/user-dashboard');

  if (hideFooterOn.includes(pathname) || isDashboard) {
    return null;
  }

  return <Footer />;
};

export default FooterWrapper;