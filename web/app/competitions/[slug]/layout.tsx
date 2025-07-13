import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

// Generate metadata for each competition post page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Competition Not Found',
    };
  }

  return {
    title: `${post.meta.title} | Pilipinas Taekwondo Inc.`,
    description: post.meta.description || '', // Optional
  };
}

// Layout wrapper for individual competition pages
export default function CompetitionLayout({ children }: Props) {
  return <>{children}</>;
}