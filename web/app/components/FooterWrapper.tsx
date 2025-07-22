'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/app/components/Footer';

const FooterWrapper = () => {
  const pathname = usePathname();

  // Hide footer on these base paths and any sub-paths
  const hideFooterOn = ['/auth/sign-in', '/auth/register', '/user-dashboard', '/admin-dashboard'];

  const shouldHideFooter = hideFooterOn.some((path) => pathname.startsWith(path));

  if (shouldHideFooter) return null;

  return <Footer />;
};

export default FooterWrapper;