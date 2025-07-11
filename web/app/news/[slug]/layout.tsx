import type { Metadata } from 'next';
import { getNewsBySlug} from '@/lib/news';
import React from 'react';

// ✅ Make sure Props is declared before using it
type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const news = getNewsBySlug(params.slug);

    if (!news) {
        return {
            title: 'News Not Found',
        };
    }

    return {
        title: news.meta.title,
        description: news.meta.description || '', // Optional: if you have a meta description
    };
}

export default function NewsSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // or wrap in a layout wrapper if needed
}