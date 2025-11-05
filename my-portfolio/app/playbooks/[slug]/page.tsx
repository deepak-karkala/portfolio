import { getPlaybookBySlug, getPlaybookChapters, getPlaybooks } from '@/lib/content';
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
function groupChapters(chapters: Array<{ order?: number; title: string; slug: string }>) {
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

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;

  const playbook = await getPlaybookBySlug(slug);
  const chapters = await getPlaybookChapters(slug);

  if (!playbook) {
    notFound();
  }

  const groupedChapters = groupChapters(chapters);

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
                            className="text-xs hover:opacity-80 transition-opacity block"
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
        <div className="card p-8 text-center">
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--color-foreground)' }}
          >
            Want Feedback on Your Agent Roadmap?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--color-primary)' }}>
            I work with CTOs and engineering teams to stand up agentic systems with the right evaluation, observability, and governance controls. Let&apos;s partner on your next milestone.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Start a Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
