import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

// Generate metadata for each competition post page

// Layout wrapper for individual competition pages
export default function CompetitionLayout({ children }: Props) {
  return <>{children}</>;
}