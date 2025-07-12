import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const newsDirectory = path.join(process.cwd(), 'content/news');

export function getNewsSlugs() {
  return fs.readdirSync(newsDirectory).filter(file => file.endsWith('.mdx'));
}

export function getNewsBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(newsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: data,
    content,
  };
}

export function getAllNews() {
  const slugs = getNewsSlugs();
  const news = slugs.map(slug => getNewsBySlug(slug));
  
  // Sort news by date (newest first)
  return news.sort((a, b) => {
    const dateA = new Date(a.meta.date);
    const dateB = new Date(b.meta.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getPaginatedNews(page: number = 1, limit: number = 5) {
  const allNews = getAllNews();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    news: allNews.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(allNews.length / limit),
    totalNews: allNews.length,
    hasNextPage: endIndex < allNews.length,
    hasPrevPage: page > 1
  };
}

export function getFeaturedNews(): string | null {
  const allNews = getAllNews();
  return allNews.length > 0 ? allNews[0].slug : null;
}

export function getRecentNews(excludeSlug?: string, limit: number = 5) {
  const allNews = getAllNews();
  const filteredNews = excludeSlug 
    ? allNews.filter(news => news.slug !== excludeSlug) 
    : allNews;
  
  return filteredNews.slice(0, limit);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
