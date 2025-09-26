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

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;

  const playbook = await getPlaybookBySlug(slug);
  const chapters = await getPlaybookChapters(slug);

  if (!playbook) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href="/playbooks"
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Playbooks
          </Link>
        </div>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {playbook.status && (
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-foreground)',
                }}
              >
                {playbook.status}
              </span>
            )}
            {playbook.level && (
              <span className="text-sm" style={{ color: 'var(--color-primary)' }}>
                Level: {playbook.level}
              </span>
            )}
            {playbook.date && (
              <span className="text-sm" style={{ color: 'var(--color-primary)' }}>
                Updated {playbook.date}
              </span>
            )}
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-foreground)' }}
          >
            {playbook.title}
          </h1>

          <p className="text-xl" style={{ color: 'var(--color-primary)' }}>
            {playbook.summary}
          </p>
        </header>

        <article
          className="markdown-body mb-16"
          dangerouslySetInnerHTML={{ __html: playbook.content }}
        />

        <section className="mb-16">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            Chapters
          </h2>

          {chapters.length > 0 ? (
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.slug}
                  href={`/playbooks/${slug}/${chapter.slug}`}
                  className="card block hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <span
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Chapter {chapter.order ?? index + 1}
                      </span>
                      <h3
                        className="text-2xl font-bold mt-1"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {chapter.title}
                      </h3>
                      {chapter.summary && (
                        <p
                          className="mt-2 text-base"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {chapter.summary}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-sm font-medium whitespace-nowrap"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      View Chapter →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card">
              <p style={{ color: 'var(--color-primary)' }}>
                Additional chapters are in development. Subscribe or reach out if you would like an early preview.
              </p>
            </div>
          )}
        </section>

        <div className="card p-8">
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--color-foreground)' }}
          >
            Want feedback on your agent roadmap?
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-primary)' }}>
            I work with teams to stand up agentic systems with the right evaluation, observability, and governance controls. Let’s partner on your next milestone.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Start a Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
