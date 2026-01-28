import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

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
  logo?: string; // Path to logo file (e.g., '/logos/epfl.png')
  // Product-specific properties
  heroSubtitle?: string;
  demoVideos?: string[];
  features?: Record<string, unknown>[];
  steps?: Record<string, unknown>[];
  pricing?: Record<string, unknown>[];
  stats?: Record<string, unknown>[];
  externalUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  // Venture-specific properties
  location?: string;
  role?: string;
  websiteUrl?: string;
  // Data visualisation-specific properties
  vizUrl?: string;
  aspectRatio?: string;
  featured?: boolean;
  // Experience-specific properties
  duration?: string;
  company?: string;
  businessImpact?: Array<{ metric: string; value: string }>;
  categoryDuration?: string; // For category-level date ranges
  // Education-specific properties
  institution?: string;
  degree?: string;
  field?: string;
  grade?: string;
}

export interface PlaybookChapter extends ContentItem {
  parentSlug: string;
}

// Helper to recursively get all files
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

// Generic function to get all content items from a directory
export async function getAllContent(contentType: string): Promise<ContentItem[]> {
  const fullPath = path.join(contentDirectory, contentType);

  // Create directory if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    return [];
  }

  const allFiles = getAllFiles(fullPath);

  const allContentData = await Promise.all(
    allFiles
      .filter((filePath) => filePath.endsWith('.md'))
      .map(async (filePath) => {
        // Calculate slug relative to the content type directory
        const relativePath = path.relative(fullPath, filePath);
        const slug = relativePath.replace(/\.md$/, '');

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML with syntax highlighting
        const processedContent = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeHighlight)
          .use(rehypeSlug)
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(content);
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
          logo: data.logo || '',
          // Product-specific properties
          heroSubtitle: data.heroSubtitle || '',
          demoVideos: data.demoVideos || [],
          features: data.features || [],
          steps: data.steps || [],
          pricing: data.pricing || [],
          stats: data.stats || [],
          externalUrl: data.externalUrl || '',
          githubUrl: data.githubUrl || '',
          docsUrl: data.docsUrl || '',
          // Data visualisation-specific properties
          vizUrl: data.vizUrl || '',
          aspectRatio: data.aspectRatio || '',
          featured: data.featured || false,
          // Venture & Experience-specific properties
          location: data.location || '',
          role: data.role || '',
          websiteUrl: data.websiteUrl || '',
          duration: data.duration || '',
          company: data.company || '',
          businessImpact: data.businessImpact || [],
          categoryDuration: data.categoryDuration || '',
          // Education-specific properties
          institution: data.institution || '',
          degree: data.degree || '',
          field: data.field || '',
          grade: data.grade || '',
        } as ContentItem;
      })
  );

  return allContentData.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Generic function to get a single content item by slug
export async function getContentBySlug(contentType: string, slug: string): Promise<ContentItem | null> {
  try {
    const fullPath = path.join(contentDirectory, contentType, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML (allow dangerous HTML for images)
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeSlug)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);
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
      logo: data.logo || '',
      // Product-specific properties
      heroSubtitle: data.heroSubtitle || '',
      demoVideos: data.demoVideos || [],
      features: data.features || [],
      steps: data.steps || [],
      pricing: data.pricing || [],
      stats: data.stats || [],
      externalUrl: data.externalUrl || '',
      githubUrl: data.githubUrl || '',
      docsUrl: data.docsUrl || '',
      // Venture-specific properties
      location: data.location || '',
      role: data.role || '',
      websiteUrl: data.websiteUrl || '',
      // Data visualisation-specific properties
      vizUrl: data.vizUrl || '',
      aspectRatio: data.aspectRatio || '',
      featured: data.featured || false,
      // Experience-specific properties
      duration: data.duration || '',
      company: data.company || '',
      businessImpact: data.businessImpact || [],
      categoryDuration: data.categoryDuration || '',
      // Education-specific properties
      institution: data.institution || '',
      degree: data.degree || '',
      field: data.field || '',
      grade: data.grade || '',
    } as ContentItem;
  } catch {
    return null;
  }
}

// Specific content type functions
export const getCaseStudies = () => getAllContent('case-studies');
export const getCaseStudyBySlug = (slug: string) => getContentBySlug('case-studies', slug);

export const getExperiences = () => getAllContent('experiences');
export const getExperienceBySlug = (slug: string) => getContentBySlug('experiences', slug);

export const getProducts = async () => {
  const allProducts = await getAllContent('products');
  // Filter out non-product markdown files (reference docs, analysis files, etc.)
  const excludePatterns = [
    'case_study_for_portfolio',
    'narrative_captions_qualitative_analysis',
    'agentic_mlops_portfolio_page',
    'learn_with_ai',
  ];

  return allProducts.filter(product => {
    return !excludePatterns.some(pattern => product.slug.includes(pattern));
  });
};
export const getProductBySlug = (slug: string) => getContentBySlug('products', slug);

// Get only top-level playbooks (not chapters in subdirectories)
export async function getPlaybooks(): Promise<ContentItem[]> {
  const fullPath = path.join(contentDirectory, 'playbooks');

  // Create directory if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    return [];
  }

  // Only get files directly in the playbooks directory, not in subdirectories
  const files = fs.readdirSync(fullPath);

  const playbookData = await Promise.all(
    files
      .filter((file) => {
        const filePath = path.join(fullPath, file);
        // Only include markdown files that are not directories
        return file.endsWith('.md') && fs.statSync(filePath).isFile();
      })
      .map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const fileContents = fs.readFileSync(path.join(fullPath, file), 'utf8');
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML
        const processedContent = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(content);
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
          externalUrl: data.externalUrl || '',
          githubUrl: data.githubUrl || '',
          docsUrl: data.docsUrl || '',
        } as ContentItem;
      })
  );

  // Custom sort order: mlops-production-guide first, aws-for-mlops last, others by date
  return playbookData.sort((a, b) => {
    // mlops-production-guide always first
    if (a.slug === 'mlops-production-guide') return -1;
    if (b.slug === 'mlops-production-guide') return 1;

    // aws-for-mlops always last
    if (a.slug === 'aws-for-mlops') return 1;
    if (b.slug === 'aws-for-mlops') return -1;

    // For all others, sort by date (newest first)
    return a.date > b.date ? -1 : 1;
  });
}

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

      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);
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

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);
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

export const getAgenticAIProducts = () => getAllContent('agentic-ai-products');
export const getAgenticAIProductBySlug = (slug: string) => getContentBySlug('agentic-ai-products', slug);

export const getIllustratedGuides = () => getAllContent('illustrated-guides');
export const getIllustratedGuideBySlug = (slug: string) => getContentBySlug('illustrated-guides', slug);

export const getVentures = () => getAllContent('ventures');
export const getVentureBySlug = (slug: string) => getContentBySlug('ventures', slug);

export const getDataVisualisations = () => getAllContent('data-visualisation');

export const getEducation = () => getAllContent('education');
export const getEducationBySlug = (slug: string) => getContentBySlug('education', slug);

// AWS for MLOps specific types and functions
export interface AwsService {
  slug: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  category: string;
}

export interface AwsCategory {
  slug: string;
  title: string;
  order: number;
  serviceCount: number;
}

export async function getAwsCategories(): Promise<AwsCategory[]> {
  const awsDir = path.join(contentDirectory, 'playbooks', 'aws-for-mlops');

  if (!fs.existsSync(awsDir)) {
    return [];
  }

  const categoryOrder: Record<string, number> = {
    'async_event_driven': 1,
    'compute': 2,
    'databases': 3,
    'edge_routing': 4,
    'etl': 5,
    'observability': 6,
    'orchestration': 7,
    'sagemaker': 8,
    'streaming': 9,
  };

  const categoryTitles: Record<string, string> = {
    'async_event_driven': 'Async & Event-Driven',
    'compute': 'Compute',
    'databases': 'Databases & Storage',
    'edge_routing': 'Edge & Routing',
    'etl': 'ETL & Analytics',
    'observability': 'Observability',
    'orchestration': 'Orchestration',
    'sagemaker': 'SageMaker',
    'streaming': 'Streaming',
  };

  const categoryDirs = fs.readdirSync(awsDir)
    .filter((name) => {
      const fullPath = path.join(awsDir, name);
      return fs.statSync(fullPath).isDirectory();
    });

  const categories = categoryDirs.map((slug) => {
    const categoryPath = path.join(awsDir, slug);
    const services = fs.readdirSync(categoryPath)
      .filter((name) =>
        name.endsWith('.md') &&
        name !== 'index.md' &&
        name !== 'when_to_use_which.md'
      );

    return {
      slug,
      title: categoryTitles[slug] || slug,
      order: categoryOrder[slug] || 999,
      serviceCount: services.length,
    };
  });

  return categories.sort((a, b) => a.order - b.order);
}

export async function getAwsCategoryServices(categorySlug: string): Promise<AwsService[]> {
  const categoryPath = path.join(contentDirectory, 'playbooks', 'aws-for-mlops', categorySlug);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath)
    .filter((name) =>
      name.endsWith('.md') &&
      name !== 'index.md' &&
      name !== 'when_to_use_which.md'
    );

  const services = await Promise.all(
    files.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);

      return {
        slug,
        title: data.title || slug,
        summary: data.summary || '',
        content: processedContent.toString(),
        order: data.order || 999,
        category: categorySlug,
      } as AwsService;
    })
  );

  return services.sort((a, b) => a.order - b.order);
}

export async function getAwsCategoryComparison(categorySlug: string): Promise<string | null> {
  const comparisonPath = path.join(
    contentDirectory,
    'playbooks',
    'aws-for-mlops',
    categorySlug,
    'when_to_use_which.md'
  );

  if (!fs.existsSync(comparisonPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(comparisonPath, 'utf8');
  const { content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return processedContent.toString();
}

export async function getAwsService(
  categorySlug: string,
  serviceSlug: string
): Promise<AwsService | null> {
  const servicePath = path.join(
    contentDirectory,
    'playbooks',
    'aws-for-mlops',
    categorySlug,
    `${serviceSlug}.md`
  );

  if (!fs.existsSync(servicePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(servicePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    slug: serviceSlug,
    title: data.title || serviceSlug,
    summary: data.summary || '',
    content: processedContent.toString(),
    order: data.order || 999,
    category: categorySlug,
  } as AwsService;
}
