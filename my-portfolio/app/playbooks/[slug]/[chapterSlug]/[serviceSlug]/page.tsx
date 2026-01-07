import {
  getAwsCategories,
  getAwsCategoryServices,
  getAwsService,
  type AwsCategory,
} from '@/lib/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ServicePageProps {
  params: Promise<{
    slug: string;
    chapterSlug: string;
    serviceSlug: string;
  }>;
}

export async function generateStaticParams() {
  // Only generate for aws-for-mlops playbook
  const categories = await getAwsCategories();

  const params = await Promise.all(
    categories.map(async (category) => {
      const services = await getAwsCategoryServices(category.slug);
      return services.map((service) => ({
        slug: 'aws-for-mlops',
        chapterSlug: category.slug,
        serviceSlug: service.slug,
      }));
    })
  );

  return params.flat();
}

// AWS Sidebar Component (shared with category page)
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
    <div className="card sticky top-24">
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
                  backgroundColor: isActive
                    ? 'color-mix(in srgb, var(--color-secondary) 20%, transparent)'
                    : 'transparent',
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

export default async function AwsServicePage({ params }: ServicePageProps) {
  const { slug, chapterSlug: categorySlug, serviceSlug } = await params;

  // Only handle aws-for-mlops playbook
  if (slug !== 'aws-for-mlops') {
    notFound();
  }

  const [categories, service, allServicesInCategory] = await Promise.all([
    getAwsCategories(),
    getAwsService(categorySlug, serviceSlug),
    getAwsCategoryServices(categorySlug),
  ]);

  if (!service) {
    notFound();
  }

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);
  const currentIndex = allServicesInCategory.findIndex((s) => s.slug === serviceSlug);
  const previousService = currentIndex > 0 ? allServicesInCategory[currentIndex - 1] : null;
  const nextService =
    currentIndex >= 0 && currentIndex < allServicesInCategory.length - 1
      ? allServicesInCategory[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 xl:px-0">
        <div className="mb-8">
          <Link
            href={`/playbooks/aws-for-mlops/${categorySlug}`}
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to {currentCategory?.title}
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0">
            <AwsSidebar
              categories={categories}
              activeCategory={categorySlug}
              activeService={serviceSlug}
            />
          </aside>

          {/* Service content */}
          <article className="lg:col-span-8 xl:col-span-9">
            <header className="mb-10">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3 inline-block"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-foreground)',
                }}
              >
                {currentCategory?.title}
              </span>
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: 'var(--color-foreground)' }}
              >
                {service.title}
              </h1>
              {service.summary && (
                <p className="text-lg" style={{ color: 'var(--color-primary)' }}>
                  {service.summary}
                </p>
              )}
            </header>

            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: service.content }} />

            {/* Previous/Next navigation */}
            <nav className="mt-16 grid gap-4 md:grid-cols-2">
              {previousService ? (
                <Link
                  href={`/playbooks/aws-for-mlops/${categorySlug}/${previousService.slug}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                    Previous
                  </span>
                  <p className="mt-1 font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {previousService.title}
                  </p>
                </Link>
              ) : (
                <div className="h-0 md:h-full" />
              )}

              {nextService ? (
                <Link
                  href={`/playbooks/aws-for-mlops/${categorySlug}/${nextService.slug}`}
                  className="card hover:shadow-md transition-shadow text-right"
                >
                  <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                    Next
                  </span>
                  <p className="mt-1 font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {nextService.title}
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
