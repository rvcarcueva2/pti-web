import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the base URL of your website
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pti-web.vercel.app';

// Function to get all MDX files from a directory
function getMDXFiles(directory: string): string[] {
  const contentDir = path.join(process.cwd(), 'content', directory);
  
  try {
    const files = fs.readdirSync(contentDir);
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''));
  } catch (error) {
    console.error(`Error reading ${directory} directory:`, error);
    return [];
  }
}

// Function to get metadata from MDX files
function getMDXMetadata(directory: string, slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', directory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return data;
  } catch (error) {
    console.error(`Error reading metadata for ${slug}:`, error);
    return {};
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Define static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/competitions`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/players`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/my-team`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/registration`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/auth/sign-in`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/forgot-password`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Add dynamic news routes
  const newsFiles = getMDXFiles('news');
  const newsRoutes: MetadataRoute.Sitemap = newsFiles.map(slug => {
    const metadata = getMDXMetadata('news', slug);
    const lastModified = metadata.date 
      ? new Date(metadata.date).toISOString() 
      : currentDate;

    return {
      url: `${BASE_URL}/news/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // Add dynamic featured routes
  const featuredFiles = getMDXFiles('featured');
  const featuredRoutes: MetadataRoute.Sitemap = featuredFiles.map(slug => {
    const metadata = getMDXMetadata('featured', slug);
    const lastModified = metadata.date 
      ? new Date(metadata.date).toISOString() 
      : currentDate;

    return {
      url: `${BASE_URL}/featured/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // Combine all routes
  return [...staticRoutes, ...newsRoutes, ...featuredRoutes];
}
