import { getExperienceBySlug, getExperiences, getEducationBySlug, getEducation } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ExperiencesSidebar from '@/components/ExperiencesSidebar';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const [experiences, education] = await Promise.all([
    getExperiences(),
    getEducation(),
  ]);
  return [...experiences, ...education].map((item) => ({
    slug: item.slug,
  }));
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const [experienceItem, educationItem, allExperiences, allEducation] = await Promise.all([
    getExperienceBySlug(slug),
    getEducationBySlug(slug),
    getExperiences(),
    getEducation(),
  ]);

  const experience = experienceItem || educationItem;
  const allItems = [...allExperiences, ...allEducation];

  if (!experience) {
    notFound();
  }

  // Find previous and next experiences within the same category
  const sameCategory = allItems
    .filter((exp) => exp.category === experience.category)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const currentIndex = sameCategory.findIndex((exp) => exp.slug === slug);
  const previousExperience = currentIndex > 0 ? sameCategory[currentIndex - 1] : null;
  const nextExperience =
    currentIndex >= 0 && currentIndex < sameCategory.length - 1
      ? sameCategory[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/experiences"
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Experiences
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0">
            <ExperiencesSidebar
              experiences={allItems}
              activeSlug={slug}
            />
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-8 xl:col-span-9">
            {/* Header */}
            <header className="mb-12">
              {/* Category Badge */}
              {experience.category && (
                <div className="mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: 'var(--color-secondary)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    {experience.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: 'var(--color-foreground)' }}
              >
                {experience.title}
              </h1>

              {/* Summary */}
              <p
                className="text-xl mb-6"
                style={{ color: 'var(--color-primary)' }}
              >
                {experience.summary}
              </p>

              {/* Metadata Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
                {experience.institution && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Institution:</strong>{' '}
                    {experience.websiteUrl ? (
                      <a
                        href={experience.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {experience.institution}
                      </a>
                    ) : (
                      experience.institution
                    )}
                  </div>
                )}
                {experience.degree && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Degree:</strong> {experience.degree}
                  </div>
                )}
                {experience.field && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Field:</strong> {experience.field}
                  </div>
                )}
                {experience.grade && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Grade:</strong> {experience.grade}
                  </div>
                )}
                {experience.role && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Role:</strong> {experience.role}
                  </div>
                )}
                {experience.company && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Company:</strong>{' '}
                    {experience.websiteUrl ? (
                      <a
                        href={experience.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {experience.company}
                      </a>
                    ) : (
                      experience.company
                    )}
                  </div>
                )}
                {experience.duration && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Duration:</strong> {experience.duration}
                  </div>
                )}
                {experience.location && (
                  <div style={{ color: 'var(--color-primary)' }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>Location:</strong> {experience.location}
                  </div>
                )}
              </div>

              {/* Highlights */}
              {experience.highlights && experience.highlights.length > 0 && (
                <div className="card mb-8">
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    Key Achievements
                  </h3>
                  <ul className="space-y-3" style={{ color: 'var(--color-primary)' }}>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span aria-hidden="true">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </header>

            {/* Main Content */}
            <div
              className="markdown-body mb-12"
              dangerouslySetInnerHTML={{ __html: experience.content }}
            />

            {/* Tech Stack Section */}
            {experience.techStack && experience.techStack.length > 0 && (
              <section className="mb-12 card">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {experience.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Navigation */}
            <nav className="mt-16 grid gap-4 md:grid-cols-2">
              {previousExperience ? (
                <Link
                  href={`/experiences/${previousExperience.slug}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Previous
                  </span>
                  <p
                    className="mt-1 font-semibold"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {previousExperience.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextExperience ? (
                <Link
                  href={`/experiences/${nextExperience.slug}`}
                  className="card hover:shadow-md transition-shadow text-right"
                >
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Next
                  </span>
                  <p
                    className="mt-1 font-semibold"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {nextExperience.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </nav>

            {/* Related/Back to All */}
            <section className="mt-12">
              <div className="card p-6 text-center">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Explore More Experiences
                </h3>
                <p className="mb-4" style={{ color: 'var(--color-primary)' }}>
                  View other projects and professional experiences
                </p>
                <Link href="/experiences" className="btn-primary">
                  View All Experiences
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
