import type { Metadata } from 'next';
import { getFeaturedBySlug } from '@/lib/featured';
import React from 'react';
import { headers } from 'next/headers';


type Props = {
  params: { slug: string };
};

export async function generateMetadata(): Promise<Metadata> {
    const headersList = headers();
    const url = (await headersList).get('x-next-url') || '';
    const slug = url.split('/').pop() || ''; // Extract the slug from the URL

    const news = await getFeaturedBySlug(slug);

    if (!news) {
        return {
            title: "Featured | Pilipinas Taekwondo Inc.",
        };
    }

    return {
        title: `${news.meta.title} | Pilipinas Taekwondo Inc.`,
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