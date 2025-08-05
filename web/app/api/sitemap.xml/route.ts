import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the base URL of your website
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pti-web.vercel.app';

// Static routes that should be included in the sitemap
const staticRoutes = [
  '',
  '/about',
  '/competitions',
  '/news',
  '/players',
  '/my-team',
  '/profile',
  '/registration',
  '/auth/sign-in',
  '/auth/register',
  '/auth/forgot-password',
];

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

// Function to generate XML for a URL
function generateSitemapURL(
  url: string, 
  lastmod?: string, 
  changefreq?: string, 
  priority?: string
): string {
  return `
  <url>
    <loc>${BASE_URL}${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`;
}

export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start building the sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    staticRoutes.forEach(route => {
      let priority = '0.8';
      let changefreq = 'weekly';
      
      // Set higher priority for important pages
      if (route === '') {
        priority = '1.0';
        changefreq = 'daily';
      } else if (route === '/competitions' || route === '/news') {
        priority = '0.9';
        changefreq = 'daily';
      } else if (route.startsWith('/auth')) {
        priority = '0.3';
        changefreq = 'monthly';
      }
      
      sitemap += generateSitemapURL(route, currentDate, changefreq, priority);
    });

    // Add dynamic news routes
    const newsFiles = getMDXFiles('news');
    newsFiles.forEach(slug => {
      const metadata = getMDXMetadata('news', slug);
      const lastmod = metadata.date 
        ? new Date(metadata.date).toISOString().split('T')[0] 
        : currentDate;
      
      sitemap += generateSitemapURL(
        `/news/${slug}`, 
        lastmod, 
        'monthly', 
        '0.7'
      );
    });

    // Add dynamic featured routes
    const featuredFiles = getMDXFiles('featured');
    featuredFiles.forEach(slug => {
      const metadata = getMDXMetadata('featured', slug);
      const lastmod = metadata.date 
        ? new Date(metadata.date).toISOString().split('T')[0] 
        : currentDate;
      
      sitemap += generateSitemapURL(
        `/featured/${slug}`, 
        lastmod, 
        'monthly', 
        '0.7'
      );
    });

    // Close the sitemap
    sitemap += `
</urlset>`;

    // Return the sitemap with proper headers
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
