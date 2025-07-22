'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/app/components/Footer';

const FooterWrapper = () => {
  const pathname = usePathname();

  // Hide footer on these paths
const hideFooterOn = ['/auth/sign-in', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

  if (hideFooterOn.includes(pathname)) return null;

  return <Footer />;
};

export default FooterWrapper;