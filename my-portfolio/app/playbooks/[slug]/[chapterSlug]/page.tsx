import {
  getPlaybookBySlug,
  getPlaybookChapterBySlug,
  getPlaybookChapters,
  getPlaybooks,
  getAwsCategories,
  getAwsCategoryServices,
  getAwsCategoryComparison,
  type AwsCategory,
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

// AWS Sidebar Component
async function AwsSidebar({
  categories,
  activeCategory,
  activeService,
}: {
  categories: AwsCategory[];
  activeCategory?: string;
  activeService?: string;
}) {
  // Get services for the active category only to improve performance
  const categoriesWithServices = await Promise.all(
    categories.map(async (cat) => {
      if (cat.slug === activeCategory) {
        return {
          ...cat,
          services: await getAwsCategoryServices(cat.slug),
        };
      }
      return { ...cat, services: [] };
    })
  );

  return (
    <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: 'var(--color-foreground)' }}
      >
        Categories
      </h2>
      <nav className="space-y-2">
        {categoriesWithServices.map((category) => {
          const isActive = category.slug === activeCategory;

          return (
            <div key={category.slug}>
              {/* Category header */}
              <Link
                href={`/playbooks/aws-for-mlops/${category.slug}`}
                className="block px-4 py-2 rounded transition-all duration-200"
                style={{
                  backgroundColor: isActive ? 'color-mix(in srgb, var(--color-secondary) 20%, transparent)' : 'transparent',
                  borderColor: isActive ? 'var(--color-secondary)' : 'transparent',
                  color: isActive ? 'var(--color-foreground)' : 'var(--color-primary)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{category.title}</span>
                  {/* Dropdown arrow */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Expandable services list */}
              {isActive && category.services.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/playbooks/aws-for-mlops/${category.slug}/${service.slug}`}
                      className="block px-3 py-1 text-sm rounded transition-all duration-200"
                      style={{
                        backgroundColor:
                          service.slug === activeService
                            ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)'
                            : 'transparent',
                        color:
                          service.slug === activeService
                            ? 'var(--color-accent)'
                            : 'var(--color-primary)',
                      }}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

// AWS Category Page Component
async function AwsCategoryPage({ categorySlug }: { categorySlug: string }) {
  const [categories, services, comparison] = await Promise.all([
    getAwsCategories(),
    getAwsCategoryServices(categorySlug),
    getAwsCategoryComparison(categorySlug),
  ]);

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 xl:px-0">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/playbooks/aws-for-mlops"
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to AWS for MLOps
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* Sidebar with expandable categories */}
          <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0">
            <AwsSidebar categories={categories} activeCategory={categorySlug} />
          </aside>

          {/* Main content */}
          <article className="lg:col-span-8 xl:col-span-9">
            <header className="mb-10">
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: 'var(--color-foreground)' }}
              >
                {currentCategory.title}
              </h1>
              <p className="text-lg" style={{ color: 'var(--color-primary)' }}>
                {services.length} service{services.length !== 1 ? 's' : ''} in this category
              </p>
            </header>

            {/* Service list */}
            <div className="space-y-4 mb-12">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/playbooks/aws-for-mlops/${categorySlug}/${service.slug}`}
                  className="card block hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-2xl font-bold mb-2 group-hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {service.title}
                      </h3>
                      {service.summary && (
                        <p
                          className="text-base"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {service.summary}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Comparison section */}
            {comparison && (
              <div className="card mt-12">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Service Comparison Guide
                </h2>
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: comparison }}
                />
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}

export default async function PlaybookChapterPage({ params }: PlaybookChapterPageProps) {
  const { slug, chapterSlug } = await params;

  // Check if this is AWS playbook
  if (slug === 'aws-for-mlops') {
    const categories = await getAwsCategories();
    const isCategory = categories.some((cat) => cat.slug === chapterSlug);

    if (isCategory) {
      // Render category page
      return <AwsCategoryPage categorySlug={chapterSlug} />;
    } else {
      // It's not a category, so it should be handled by the service route
      notFound();
    }
  }

  // Original logic for other playbooks
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
        <div className="flex gap-12">
          <aside className="w-64 flex-shrink-0 mb-8 lg:mb-0 hidden lg:block">
            <div className="sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
              <nav className="space-y-1">
                <Link
                  href={`/playbooks/${slug}`}
                  className="text-sm font-semibold mb-3 text-muted-foreground hover:text-foreground block"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ← Back to {playbook.title}
                </Link>

                <h2
                  className="text-sm font-bold mb-2 mt-4 px-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Chapters
                </h2>

                <div className="border-t border-muted pt-2" style={{ borderColor: 'var(--color-card-border)' }}>
                  <div className="ml-2 mt-1 space-y-0.5 border-l-2 pl-2" style={{ borderColor: 'var(--color-card-border)' }}>
                    {chapters.map((item) => {
                      const isActive = item.slug === chapter.slug;
                      return (
                        <Link
                          key={item.slug}
                          href={`/playbooks/${slug}/${item.slug}`}
                          className={`block w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${isActive
                            ? 'font-medium'
                            : 'hover:opacity-80'
                            }`}
                          style={{
                            backgroundColor: isActive
                              ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
                              : 'transparent',
                            color: isActive
                              ? 'var(--color-primary)'
                              : 'var(--color-primary)',
                          }}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>
          </aside>

          <article className="flex-1 min-w-0">
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
