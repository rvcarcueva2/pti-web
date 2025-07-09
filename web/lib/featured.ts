import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const featuredDirectory = path.join(process.cwd(), 'content/featured');

export function getFeaturedBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(featuredDirectory, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: data,
    content,
  };
}

export function getFeaturedNews() {
  return getFeaturedBySlug('featured1');
}
