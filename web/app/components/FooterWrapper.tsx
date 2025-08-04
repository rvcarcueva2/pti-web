'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/app/components/Footer';

const FooterWrapper = () => {
  const pathname = usePathname();

  // Combined list of exact paths to hide the footer
  const hideFooterOn = [
    '/auth/sign-in',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  // Hide on any path that starts with these base routes
  const hideIfStartsWith = ['/admin-panel'];

  const shouldHideFooter =
    hideFooterOn.includes(pathname) || hideIfStartsWith.some((path) => pathname.startsWith(path));

  if (shouldHideFooter) return null;

  return <Footer />;
};

export default FooterWrapper;