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

export function getFeaturedNews(): string | null {
  const allNews = getAllNews();
  return allNews.length > 0 ? allNews[0].slug : null;
}
