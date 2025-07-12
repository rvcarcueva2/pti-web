import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/competitions');

export function getPostSlugs() {
  return fs.readdirSync(contentDirectory).filter(file => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: data,
    content,
  };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs.map(slug => getPostBySlug(slug));
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.meta.date);
    const dateB = new Date(b.meta.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getFirstImageFromPost(slug: string): string | null {
  try {
    const post = getPostBySlug(slug);
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = post.content.match(imageRegex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

export function getFeaturedImage(): string | null {
  const posts = getAllPosts();
  console.log('All posts:', posts.map(p => ({ slug: p.slug, title: p.meta.title })));
  
  if (posts.length === 0) return null;
  
  // Search through all posts to find the first one with an image
  for (const post of posts) {
    const image = getFirstImageFromPost(post.slug);
    console.log(`Checking post ${post.slug}, found image:`, image);
    if (image) {
      return image;
    }
  }
  
  return null;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
