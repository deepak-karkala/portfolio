import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ContentItem {
  slug: string;
  title: string;
  summary: string;
  date: string;
  image?: string;
  techStack?: string[];
  status?: string;
  category?: string;
  content: string;
  excerpt?: string;
  level?: string;
  video?: string;
  order?: number;
  highlights?: string[];
  // Product-specific properties
  heroSubtitle?: string;
  demoVideos?: string[];
  features?: Record<string, unknown>[];
  steps?: Record<string, unknown>[];
  pricing?: Record<string, unknown>[];
  stats?: Record<string, unknown>[];
}

export interface PlaybookChapter extends ContentItem {
  parentSlug: string;
}

// Generic function to get all content items from a directory
export async function getAllContent(contentType: string): Promise<ContentItem[]> {
  const fullPath = path.join(contentDirectory, contentType);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(fullPath);
  const allContentData = await Promise.all(
    fileNames
      .filter((name) => name.endsWith('.md'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullFilePath = path.join(fullPath, fileName);
        const fileContents = fs.readFileSync(fullFilePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML (allow dangerous HTML for images)
        const processedContent = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
        const contentHtml = processedContent.toString();

        const techStack = Array.isArray(data.techStack)
          ? data.techStack
          : data.techStack
          ? [String(data.techStack)]
          : [];

        const highlights = Array.isArray(data.highlights)
          ? data.highlights.map((item) => String(item))
          : data.highlights
          ? [String(data.highlights)]
          : [];

        const order =
          typeof data.order === 'number'
            ? data.order
            : data.order
            ? Number(data.order)
            : undefined;

        return {
          slug,
          content: contentHtml,
          title: data.title || slug,
          summary: data.summary || '',
          date: data.date || '',
          image: data.image || '',
          techStack,
          status: data.status || '',
          category: data.category || '',
          excerpt: data.excerpt || '',
          level: data.level || '',
          video: data.video || '',
          order,
          highlights,
          // Product-specific properties
          heroSubtitle: data.heroSubtitle || '',
          demoVideos: data.demoVideos || [],
          features: data.features || [],
          steps: data.steps || [],
          pricing: data.pricing || [],
          stats: data.stats || [],
        } as ContentItem;
      })
  );

  return allContentData.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Generic function to get a single content item by slug
export async function getContentBySlug(contentType: string, slug: string): Promise<ContentItem | null> {
  try {
    const fullPath = path.join(contentDirectory, contentType, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML (allow dangerous HTML for images)
    const processedContent = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
    const contentHtml = processedContent.toString();

    const techStack = Array.isArray(data.techStack)
      ? data.techStack
      : data.techStack
      ? [String(data.techStack)]
      : [];

    const highlights = Array.isArray(data.highlights)
      ? data.highlights.map((item) => String(item))
      : data.highlights
      ? [String(data.highlights)]
      : [];

    const order =
      typeof data.order === 'number'
        ? data.order
        : data.order
        ? Number(data.order)
        : undefined;

    return {
      slug,
      content: contentHtml,
      title: data.title || slug,
      summary: data.summary || '',
      date: data.date || '',
      image: data.image || '',
      techStack,
      status: data.status || '',
      category: data.category || '',
      excerpt: data.excerpt || '',
      level: data.level || '',
      video: data.video || '',
      order,
      highlights,
      // Product-specific properties
      heroSubtitle: data.heroSubtitle || '',
      demoVideos: data.demoVideos || [],
      features: data.features || [],
      steps: data.steps || [],
      pricing: data.pricing || [],
      stats: data.stats || [],
    } as ContentItem;
  } catch {
    return null;
  }
}

// Specific content type functions
export const getCaseStudies = () => getAllContent('case-studies');
export const getCaseStudyBySlug = (slug: string) => getContentBySlug('case-studies', slug);

export const getProducts = () => getAllContent('products');
export const getProductBySlug = (slug: string) => getContentBySlug('products', slug);

export const getPlaybooks = () => getAllContent('playbooks');
export const getPlaybookBySlug = (slug: string) => getContentBySlug('playbooks', slug);

export async function getPlaybookChapters(playbookSlug: string): Promise<PlaybookChapter[]> {
  const chaptersDir = path.join(contentDirectory, 'playbooks', playbookSlug);

  if (!fs.existsSync(chaptersDir)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(chaptersDir)
    .filter((name) => name.endsWith('.md'));

  const chapters = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(chaptersDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const processedContent = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
      const contentHtml = processedContent.toString();

      const techStack = Array.isArray(data.techStack)
        ? data.techStack
        : data.techStack
        ? [String(data.techStack)]
        : [];

      const order =
        typeof data.order === 'number'
          ? data.order
          : data.order
          ? Number(data.order)
          : undefined;

      return {
        slug,
        parentSlug: playbookSlug,
        content: contentHtml,
        title: data.title || slug,
        summary: data.summary || '',
        date: data.date || '',
        image: data.image || '',
        techStack,
        status: data.status || '',
        category: data.category || '',
        excerpt: data.excerpt || '',
        level: data.level || '',
        video: data.video || '',
        order,
        // Product-specific properties
        heroSubtitle: data.heroSubtitle || '',
        demoVideos: data.demoVideos || [],
        features: data.features || [],
        steps: data.steps || [],
        pricing: data.pricing || [],
        stats: data.stats || [],
      } as PlaybookChapter;
    })
  );

  return chapters.sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.title.localeCompare(b.title);
  });
}

export async function getPlaybookChapterBySlug(
  playbookSlug: string,
  chapterSlug: string
): Promise<PlaybookChapter | null> {
  const chaptersDir = path.join(contentDirectory, 'playbooks', playbookSlug);

  try {
    const fullPath = path.join(chaptersDir, `${chapterSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
    const contentHtml = processedContent.toString();

    const techStack = Array.isArray(data.techStack)
      ? data.techStack
      : data.techStack
      ? [String(data.techStack)]
      : [];

    const order =
      typeof data.order === 'number'
        ? data.order
        : data.order
        ? Number(data.order)
        : undefined;

    return {
      slug: chapterSlug,
      parentSlug: playbookSlug,
      content: contentHtml,
      title: data.title || chapterSlug,
      summary: data.summary || '',
      date: data.date || '',
      image: data.image || '',
      techStack,
      status: data.status || '',
      category: data.category || '',
      excerpt: data.excerpt || '',
      level: data.level || '',
      video: data.video || '',
      order,
      // Product-specific properties
      heroSubtitle: data.heroSubtitle || '',
      demoVideos: data.demoVideos || [],
      features: data.features || [],
      steps: data.steps || [],
      pricing: data.pricing || [],
      stats: data.stats || [],
    } as PlaybookChapter;
  } catch {
    return null;
  }
}

export const getResearch = () => getAllContent('research');
export const getResearchBySlug = (slug: string) => getContentBySlug('research', slug);

export const getBlogPosts = () => getAllContent('blog');
export const getBlogPostBySlug = (slug: string) => getContentBySlug('blog', slug);
