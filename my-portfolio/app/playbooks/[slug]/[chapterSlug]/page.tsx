import {
  getPlaybookBySlug,
  getPlaybookChapterBySlug,
  getPlaybookChapters,
  getPlaybooks,
} from '@/lib/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PlaybookChapterPageProps {
  params: Promise<{
    slug: string;
    chapterSlug: string;
  }>;
}

export async function generateStaticParams() {
  const playbooks = await getPlaybooks();

  const params = await Promise.all(
    playbooks.map(async (playbook) => {
      const chapters = await getPlaybookChapters(playbook.slug);
      return chapters.map((chapter) => ({
        slug: playbook.slug,
        chapterSlug: chapter.slug,
      }));
    })
  );

  return params.flat();
}

export default async function PlaybookChapterPage({ params }: PlaybookChapterPageProps) {
  const { slug, chapterSlug } = await params;

  const [playbook, chapter, chapters] = await Promise.all([
    getPlaybookBySlug(slug),
    getPlaybookChapterBySlug(slug, chapterSlug),
    getPlaybookChapters(slug),
  ]);

  if (!playbook || !chapter) {
    notFound();
  }

  const currentIndex = chapters.findIndex((item) => item.slug === chapter.slug);
  const previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 xl:px-0">
        <div className="mb-8">
          <Link
            href={`/playbooks/${slug}`}
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to {playbook.title}
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-10">
          <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0">
            <div className="card sticky top-24">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: 'var(--color-foreground)' }}
              >
                Course Chapters
              </h2>
              <nav className="space-y-2">
                {chapters.map((item, index) => {
                  const isActive = item.slug === chapter.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/playbooks/${slug}/${item.slug}`}
                      className="block rounded-lg border px-4 py-3 transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? 'color-mix(in srgb, var(--color-secondary) 20%, transparent)' : 'transparent',
                        borderColor: isActive ? 'var(--color-secondary)' : 'transparent',
                        color: isActive ? 'var(--color-foreground)' : 'var(--color-primary)',
                      }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm uppercase font-semibold tracking-wide" style={{ color: isActive ? 'var(--color-foreground)' : 'var(--color-primary)' }}>
                              Chapter {item.order ?? index + 1}
                            </p>
                            <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                              {item.title}
                            </p>
                            {item.excerpt && (
                              <p className="text-sm" style={{ color: isActive ? 'var(--color-foreground)' : 'var(--color-primary)' }}>
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <article className="lg:col-span-8 xl:col-span-9">
            <header className="mb-10">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3 inline-block"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-foreground)',
                }}
              >
                Chapter {chapter.order ?? currentIndex + 1}
              </span>
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: 'var(--color-foreground)' }}
              >
                {chapter.title}
              </h1>
              {chapter.summary && (
                <p className="text-lg" style={{ color: 'var(--color-primary)' }}>
                  {chapter.summary}
                </p>
              )}
            </header>

            {chapter.video && (
              <div className="mb-10">
                <div className="aspect-video rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-card-border)' }}>
                  <video controls className="w-full h-full bg-black">
                    <source src={chapter.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-primary)' }}>
                  Video walkthrough for {chapter.title}
                </p>
              </div>
            )}

            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />

            <nav className="mt-16 grid gap-4 md:grid-cols-2">
              {previousChapter ? (
                <Link
                  href={`/playbooks/${slug}/${previousChapter.slug}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                    Previous
                  </span>
                  <p className="mt-1 font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {previousChapter.title}
                  </p>
                </Link>
              ) : (
                <div className="h-0 md:h-full" />
              )}

              {nextChapter ? (
                <Link
                  href={`/playbooks/${slug}/${nextChapter.slug}`}
                  className="card hover:shadow-md transition-shadow text-right"
                >
                  <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                    Next
                  </span>
                  <p className="mt-1 font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {nextChapter.title}
                  </p>
                </Link>
              ) : (
                <div className="h-0 md:h-full" />
              )}
            </nav>
          </article>
        </div>
      </div>
    </div>
  );
}
