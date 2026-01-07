import {
  getPlaybookBySlug,
  getPlaybookChapters,
  getPlaybooks,
  getAwsCategories,
  getAwsCategoryServices,
} from '@/lib/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PlaybookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const playbooks = await getPlaybooks();
  return playbooks.map((playbook) => ({
    slug: playbook.slug,
  }));
}

// Helper function to extract chapter title from full title
function getChapterTitle(fullTitle: string): string {
  // Remove "Chapter X: " prefix if present
  return fullTitle.replace(/^Chapter \d+:\s*/, '');
}

// Helper function to group chapters into sections
function groupChapters(chapters: Array<{ order?: number; title: string; slug: string }>, playbookSlug: string) {
  // Agents playbook grouping
  if (playbookSlug === 'agents') {
    const groups: { [key: string]: Array<{ order?: number; title: string; slug: string; shortTitle?: string }> } = {
      'Fundamentals': [],
      'Building Blocks': [],
      'Design Patterns': [],
      'Operations': [],
      'Optimization': []
    };

    chapters.forEach((chapter) => {
      const order = chapter.order || 0;

      if (order === 1) groups['Fundamentals'].push({ ...chapter, shortTitle: 'Agent Fundamentals' });
      else if (order === 2) groups['Building Blocks'].push({ ...chapter, shortTitle: 'Prompts & Persona' });
      else if (order === 3) groups['Building Blocks'].push({ ...chapter, shortTitle: 'Memory' });
      else if (order === 4) groups['Building Blocks'].push({ ...chapter, shortTitle: 'Tool Integration' });
      else if (order === 5) groups['Building Blocks'].push({ ...chapter, shortTitle: 'Data & RAG' });
      else if (order === 6) groups['Building Blocks'].push({ ...chapter, shortTitle: 'Orchestration' });
      else if (order === 7) groups['Design Patterns'].push({ ...chapter, shortTitle: 'Agentic Patterns' });
      else if (order === 8) groups['Design Patterns'].push({ ...chapter, shortTitle: 'Context Engineering' });
      else if (order === 9) groups['Operations'].push({ ...chapter, shortTitle: 'Evaluations' });
      else if (order === 10) groups['Operations'].push({ ...chapter, shortTitle: 'Guardrails' });
      else if (order === 11) groups['Operations'].push({ ...chapter, shortTitle: 'Monitoring' });
      else if (order === 12) groups['Operations'].push({ ...chapter, shortTitle: 'Human-in-the-Loop' });
      else if (order === 13) groups['Operations'].push({ ...chapter, shortTitle: 'Deployment' });
      else if (order === 14) groups['Operations'].push({ ...chapter, shortTitle: 'Trust & Ethics' });
      else if (order === 15) groups['Operations'].push({ ...chapter, shortTitle: 'Security' });
      else if (order === 16) groups['Optimization'].push({ ...chapter, shortTitle: 'Cost Optimization' });
      else if (order === 17) groups['Optimization'].push({ ...chapter, shortTitle: 'Latency Optimization' });
      else if (order === 18) groups['Optimization'].push({ ...chapter, shortTitle: 'Best Practices' });
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }

  // MLOps Production Guide playbook grouping
  if (playbookSlug === 'mlops-production-guide') {
    const groups: { [key: string]: Array<{ order?: number; title: string; slug: string; shortTitle?: string }> } = {
      'Foundations': [],
      'Platform & Infrastructure': [],
      'Data Engineering': [],
      'Feature Engineering': [],
      'Model Development': [],
      'Training & Testing': [],
      'Deployment & Serving': [],
      'Monitoring & Operations': [],
      'Continuous Improvement': [],
      'Governance': []
    };

    chapters.forEach((chapter) => {
      const order = chapter.order || 0;

      // Chapter 1: Foundations
      if (order === 1) groups['Foundations'].push({ ...chapter, shortTitle: 'ML Problem Framing' });

      // Chapter 2.x: Platform & Infrastructure
      else if (order === 2.1) groups['Platform & Infrastructure'].push({ ...chapter, shortTitle: 'MLOps Blueprint & Operational Strategy' });
      else if (order === 2.2) groups['Platform & Infrastructure'].push({ ...chapter, shortTitle: 'MLOps Platforms' });

      // Chapter 3.x: Platform & Infrastructure
      else if (order === 3.1) groups['Platform & Infrastructure'].push({ ...chapter, shortTitle: 'Environments, Branching, CI/CD & Deployments' });

      // Chapter 4.x: Data Engineering
      else if (order === 4.1) groups['Data Engineering'].push({ ...chapter, shortTitle: 'Data Sourcing, Discovery & Understanding' });
      else if (order === 4.2) groups['Data Engineering'].push({ ...chapter, shortTitle: 'Data Discovery Platforms' });

      // Chapter 5.x: Data Engineering
      else if (order === 5.1) groups['Data Engineering'].push({ ...chapter, shortTitle: 'Data Engineering & Pipelines' });
      else if (order === 5.2) groups['Data Engineering'].push({ ...chapter, shortTitle: 'Real-Time & Streaming Pipelines' });

      // Chapter 6.x: Feature Engineering
      else if (order === 6.1) groups['Feature Engineering'].push({ ...chapter, shortTitle: 'Feature Engineering' });
      else if (order === 6.2) groups['Feature Engineering'].push({ ...chapter, shortTitle: 'Feature Stores' });

      // Chapter 7.x: Model Development
      else if (order === 7.1) groups['Model Development'].push({ ...chapter, shortTitle: 'Model Development' });
      else if (order === 7.2) groups['Model Development'].push({ ...chapter, shortTitle: 'Model Development Lessons' });
      else if (order === 7.3) groups['Model Development'].push({ ...chapter, shortTitle: 'Training Deep Learning Models' });

      // Chapter 8.x: Training & Testing
      else if (order === 8.1) groups['Training & Testing'].push({ ...chapter, shortTitle: 'ML Training Pipelines' });

      // Chapter 9.x: Training & Testing
      else if (order === 9.1) groups['Training & Testing'].push({ ...chapter, shortTitle: 'Testing ML Systems' });

      // Chapter 10.x: Deployment & Serving
      else if (order === 10.1) groups['Deployment & Serving'].push({ ...chapter, shortTitle: 'Model Deployment & Serving' });
      else if (order === 10.2) groups['Deployment & Serving'].push({ ...chapter, shortTitle: 'Inference Stack' });

      // Chapter 11.x: Monitoring & Operations
      else if (order === 11.1) groups['Monitoring & Operations'].push({ ...chapter, shortTitle: 'Failures, Monitoring & Observability' });

      // Chapter 12.x: Continuous Improvement
      else if (order === 12.1) groups['Continuous Improvement'].push({ ...chapter, shortTitle: 'Continual Learning & Retraining' });
      else if (order === 12.2) groups['Continuous Improvement'].push({ ...chapter, shortTitle: 'Production Testing & A/B Testing' });
      else if (order === 12.3) groups['Continuous Improvement'].push({ ...chapter, shortTitle: 'A/B Testing Industry Lessons' });

      // Chapter 13.x: Governance
      else if (order === 13.1) groups['Governance'].push({ ...chapter, shortTitle: 'Governance, Ethics & Human Element' });
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }

  // GenAI Applications playbook grouping
  if (playbookSlug === 'genai-applications') {
    const groups: { [key: string]: Array<{ order?: number; title: string; slug: string; shortTitle?: string }> } = {
      'Strategy & Planning': [],
      'Architecture & Design': [],
      'Core Techniques': [],
      'Advanced Methods': [],
      'Production & Optimization': [],
      'Real-World Patterns': []
    };

    chapters.forEach((chapter) => {
      const order = chapter.order || 0;

      // Chapter 1: Strategy & Planning
      if (order === 1) groups['Strategy & Planning'].push({ ...chapter, shortTitle: 'GenAI Product Planning & Strategy' });

      // Chapter 2: Architecture & Design
      else if (order === 2) groups['Architecture & Design'].push({ ...chapter, shortTitle: 'GenAI Product Architecture' });

      // Chapters 3-4: Core Techniques
      else if (order === 3) groups['Core Techniques'].push({ ...chapter, shortTitle: 'Prompt Engineering' });
      else if (order === 4) groups['Core Techniques'].push({ ...chapter, shortTitle: 'Data + Models' });

      // Chapter 5: Advanced Methods
      else if (order === 5) groups['Advanced Methods'].push({ ...chapter, shortTitle: 'Fine-Tuning LLMs' });

      // Chapter 6: Production & Optimization
      else if (order === 6) groups['Production & Optimization'].push({ ...chapter, shortTitle: 'Evaluating Production GenAI Apps' });

      // Chapter 7: Production & Optimization
      else if (order === 7) groups['Production & Optimization'].push({ ...chapter, shortTitle: 'Deployment & Serving' });

      // Chapter 8: Advanced Methods
      else if (order === 8) groups['Advanced Methods'].push({ ...chapter, shortTitle: 'RAG - Advanced Strategies' });

      // Chapter 9: Production & Optimization
      else if (order === 9) groups['Production & Optimization'].push({ ...chapter, shortTitle: 'Inference Optimization' });

      // Chapter 10: Real-World Patterns
      else if (order === 10) groups['Real-World Patterns'].push({ ...chapter, shortTitle: 'Industry Patterns & Case Studies' });
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }

  // Stats for MLOps playbook grouping
  if (playbookSlug === 'stats-for-mlops') {
    const groups: { [key: string]: Array<{ order?: number; title: string; slug: string; shortTitle?: string }> } = {
      'Foundations': [],
      'Statistical Methods': [],
      'Production ML': []
    };

    chapters.forEach((chapter) => {
      const order = chapter.order || 0;

      if (order === 1) groups['Foundations'].push({ ...chapter, shortTitle: 'Statistical Foundations' });
      else if (order === 2) groups['Foundations'].push({ ...chapter, shortTitle: 'Core Distributions' });
      else if (order === 3) groups['Statistical Methods'].push({ ...chapter, shortTitle: 'Hypothesis Testing' });
      else if (order === 4) groups['Statistical Methods'].push({ ...chapter, shortTitle: 'Distance Measures' });
      else if (order === 5) groups['Production ML'].push({ ...chapter, shortTitle: 'A/B Testing' });
      else if (order === 6) groups['Production ML'].push({ ...chapter, shortTitle: 'Monitoring & Drift' });
      else if (order === 7) groups['Production ML'].push({ ...chapter, shortTitle: 'Uncertainty & Decisions' });
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }

  // Default grouping for other playbooks - just use chapter titles as-is
  const groups: { [key: string]: Array<{ order?: number; title: string; slug: string; shortTitle?: string }> } = {
    'Chapters': []
  };

  chapters.forEach((chapter) => {
    groups['Chapters'].push({ ...chapter, shortTitle: getChapterTitle(chapter.title) });
  });

  return groups;
}

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;

  const playbook = await getPlaybookBySlug(slug);

  if (!playbook) {
    notFound();
  }

  // Special handling for AWS playbook
  if (slug === 'aws-for-mlops') {
    const categories = await getAwsCategories();

    // Get services for each category
    const categoriesWithServices = await Promise.all(
      categories.map(async (cat) => ({
        ...cat,
        services: await getAwsCategoryServices(cat.slug),
      }))
    );

    return (
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 xl:px-0">
          <div className="mb-8">
            <Link
              href="/playbooks"
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-primary)' }}
            >
              ← Back to Playbooks
            </Link>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-10">
            {/* Sidebar with all categories and services */}
            <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0">
              <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Service Categories
                </h2>
                <nav className="space-y-3">
                  {categoriesWithServices.map((category) => (
                    <div key={category.slug}>
                      <Link
                        href={`/playbooks/aws-for-mlops/${category.slug}`}
                        className="block px-3 py-2 rounded font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {category.title}
                      </Link>
                      <div className="ml-3 mt-1 space-y-1">
                        {category.services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/playbooks/aws-for-mlops/${category.slug}/${service.slug}`}
                            className="block px-3 py-1 text-sm rounded hover:opacity-80 transition-opacity"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <article className="lg:col-span-8 xl:col-span-9">
              <header className="mb-10">
                <h1
                  className="text-4xl font-bold mb-4"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {playbook.title}
                </h1>
                <div
                  className="markdown-body"
                  style={{ color: 'var(--color-primary)' }}
                  dangerouslySetInnerHTML={{ __html: playbook.content }}
                />
              </header>

              {/* Category overview list */}
              <div className="card">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Service Categories Overview
                </h2>
                <div className="space-y-6">
                  {categoriesWithServices.map((category) => (
                    <div key={category.slug}>
                      <h3
                        className="text-lg font-bold mb-3"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {category.title}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {category.services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/playbooks/aws-for-mlops/${category.slug}/${service.slug}`}
                            className="px-4 py-2 rounded border hover:shadow-md transition-all duration-200"
                            style={{
                              borderColor: 'var(--color-card-border)',
                              color: 'var(--color-primary)',
                            }}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  // Original logic for other playbooks
  const chapters = await getPlaybookChapters(slug);
  const groupedChapters = groupChapters(chapters, slug);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/playbooks"
            className="text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Playbooks
          </Link>
        </div>

        {/* Compact Navigation Overview - Made with ML Style */}
        {chapters.length > 0 && (
          <section className="mb-12">
            <div className="card p-6">
              <h1
                className="text-3xl md:text-4xl font-bold mb-6 text-center"
                style={{ color: 'var(--color-foreground)' }}
              >
                {playbook.title}
              </h1>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Object.entries(groupedChapters).map(([groupName, groupChapters], groupIndex) => (
                  <div key={groupName}>
                    <h3
                      className="text-base font-bold mb-3 flex items-center gap-2"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-foreground)',
                        }}
                      >
                        {groupIndex + 1}
                      </span>
                      {groupName}
                    </h3>
                    <ul className="space-y-1.5">
                      {groupChapters.map((chapter) => (
                        <li key={chapter.slug}>
                          <Link
                            href={`/playbooks/${slug}/${chapter.slug}`}
                            className="text-sm font-semibold hover:opacity-80 transition-opacity block"
                            style={{ color: 'var(--color-accent)' }}
                          >
                            {chapter.shortTitle || getChapterTitle(chapter.title)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Playbook Content */}
        <article
          className="markdown-body mb-16"
          dangerouslySetInnerHTML={{ __html: playbook.content }}
        />

        {/* Detailed Chapter Cards */}
        <section className="mb-16">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: 'var(--color-foreground)' }}
          >
            Chapters
          </h2>

          {chapters.length > 0 ? (
            <div className="space-y-6">
              {chapters.map((chapter, index) => {
                // Extract key topics from summary or generate generic tags
                const topics = chapter.techStack && chapter.techStack.length > 0
                  ? chapter.techStack
                  : [];

                return (
                  <Link
                    key={chapter.slug}
                    href={`/playbooks/${slug}/${chapter.slug}`}
                    className="card block hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Chapter Number & Title */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="text-sm font-bold uppercase tracking-wide px-3 py-1 rounded"
                              style={{
                                backgroundColor: 'var(--color-secondary)',
                                color: 'var(--color-foreground)'
                              }}
                            >
                              Chapter {chapter.order ?? index + 1}
                            </span>
                          </div>
                          <h3
                            className="text-2xl md:text-3xl font-bold group-hover:opacity-80 transition-opacity"
                            style={{ color: 'var(--color-foreground)' }}
                          >
                            {getChapterTitle(chapter.title)}
                          </h3>
                        </div>
                        <span
                          className="text-lg font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          →
                        </span>
                      </div>

                      {/* Summary */}
                      {chapter.summary && (
                        <p
                          className="text-base leading-relaxed"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {chapter.summary}
                        </p>
                      )}

                      {/* Topics/Tags */}
                      {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {topics.slice(0, 5).map((topic) => (
                            <span
                              key={topic}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: 'var(--color-card-bg)',
                                color: 'var(--color-foreground)',
                                border: '1px solid var(--color-card-border)',
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="card">
              <p style={{ color: 'var(--color-primary)' }}>
                Additional chapters are in development. Subscribe or reach out if you would like an early preview.
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <div className="card px-6 py-4 text-center">
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-foreground)' }}
          >
            Work With Me
          </h3>
          <p className="mb-3 max-w-3xl mx-auto text-sm leading-snug" style={{ color: 'var(--color-primary)' }}>
            I bring hands-on experience delivering production MLOps and GenAI systems at reasonable scale—with minimal infrastructure footprint and cost-effective architectures. I&apos;m excited to collaborate on building next-generation Agentic AI systems. Whether you need expertise in MLOps, GenAI, or Agentic AI—let&apos;s connect.
          </p>
          <Link href="/contact" className="btn-primary inline-block text-sm px-5 py-2">
            Contact Me
          </Link>
        </div>
      </div>
    </div>
  );
}
