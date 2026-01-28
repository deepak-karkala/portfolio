import { getExperiences, getEducation, ContentItem } from '@/lib/content';
import Link from 'next/link';
import ExperiencesSidebar from '@/components/ExperiencesSidebar';
import ExperienceLogo from '@/components/ExperienceLogo';

// Helper to get logo from first item in category (for work experiences)
function getCategoryLogo(category: string, items: ContentItem[]): string | undefined {
  if (category !== 'Education' && category !== 'Other') {
    return items[0]?.logo;
  }
  return undefined;
}

// Helper to extract company name from category string
function extractCompanyName(category: string): string {
  if (category.includes(' at ')) {
    return category.split(' at ')[1];
  }
  if (category.includes('mid sized European ')) {
    return category.split('mid sized European ')[1];
  }
  return category;
}

// Helper to render category title with styled company name
function renderCategoryTitle(category: string): React.ReactNode {
  if (category.includes('E-commerce marketplace')) {
    const parts = category.split('mid sized European ');
    return (
      <>
        {parts[0]}mid sized European{' '}
        <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
          {parts[1]}
        </span>
      </>
    );
  }

  if (category.includes(' at ')) {
    const parts = category.split(' at ');
    return (
      <>
        {parts[0]} at{' '}
        <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
          {parts[1]}
        </span>
      </>
    );
  }

  return category;
}

// Helper to render title with styled institution/company name
function renderTitleWithStyledInstitution(experience: ContentItem): React.ReactNode {
  const { title, institution, company, category } = experience;

  if (category === 'Education' && institution) {
    return (
      <>
        <div>{title}</div>
        <div className="text-base font-bold mt-1" style={{ color: 'var(--color-accent)' }}>
          {institution}
        </div>
      </>
    );
  }

  if (category === 'Other') {
    // For items with institution (like IISc fellowship)
    if (institution && title.includes(institution)) {
      const parts = title.split(institution);
      return (
        <>
          {parts[0]}
          <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
            {institution}
          </span>
          {parts[1]}
        </>
      );
    }

    // For items with company name in the title
    if (company && title.includes(company)) {
      const parts = title.split(company);
      return (
        <>
          {parts[0]}
          <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
            {company}
          </span>
          {parts[1]}
        </>
      );
    }
  }

  return title;
}

function groupExperiences(experiences: Awaited<ReturnType<typeof getExperiences>>) {
  const groups = new Map<string, typeof experiences>();

  experiences.forEach((exp) => {
    const key = exp.category || 'Other';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(exp);
  });

  const order = [
    'Senior ML Engineer (Contract) at Mid-sized European E-commerce Marketplace (Client - NDA)',
    'ML Engineer at eSMART Technologies',
    'Machine Learning Research Intern at NEC Labs America',
    'Education',
    'Other',
  ];

  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    })
    .map(([category, items]) => ({
      category,
      items: [...items].sort((a, b) => (a.date > b.date ? -1 : 1)),
    }));
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  const education = await getEducation();
  const allItems = [...experiences, ...education];
  const groupedExperiences = groupExperiences(allItems);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}


        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 mb-8 lg:mb-0 hidden lg:block">
            <ExperiencesSidebar experiences={allItems} />
          </aside>

          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-10">
              <h1
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: 'var(--color-foreground)' }}
              >
                Work Experiences
              </h1>
              <p
                className="text mb-6"
                style={{ color: 'var(--color-primary)' }}
              >
                Professional ML engineering experience delivering production systems
                with measurable business impact across e-commerce and IoT domains.
              </p>

            </header>

            {/* Featured Experiences or Category Overview */}
            {groupedExperiences.map(({ category, items }) => {
              // Get categoryDuration/location from the first item in the category (if available)
              const categoryDuration = items[0]?.categoryDuration;
              const categoryLocation =
                category === 'Education' || category === 'Other' ? '' : items[0]?.location;
              const categoryLogo = getCategoryLogo(category, items);
              const isIndividualLogo = category === 'Education' || category === 'Other';

              return (
                <section key={category} className="mb-12">
                  <div className="mb-6 flex items-center gap-4 flex-wrap">
                    {/* Logo for category-level experiences */}
                    {categoryLogo && !isIndividualLogo && (
                      <ExperienceLogo
                        logo={categoryLogo}
                        alt={extractCompanyName(category)}
                        size="medium"
                      />
                    )}

                    {/* Title and Duration */}
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-xl font-bold break-words"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {renderCategoryTitle(category)}
                      </h2>
                      {(categoryDuration || categoryLocation) && (
                        <p
                          className="text-sm font-semibold mt-1"
                          style={{ color: 'var(--color-primary)', opacity: 0.8 }}
                        >
                          {categoryDuration && <span>{categoryDuration}</span>}
                          {categoryDuration && categoryLocation && (
                            <span className="mx-2">•</span>
                          )}
                          {categoryLocation && <span>{categoryLocation}</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((experience) => (
                      <Link
                        key={experience.slug}
                        href={`/experiences/${experience.slug}`}
                        className="card block hover:shadow-xl transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-[var(--color-accent)] p-7 relative"
                      >
                        {/* Individual card logo (Education/Other only) */}
                        {isIndividualLogo && experience.logo && (
                          <div className="absolute top-4 right-4 md:top-6 md:right-6">
                            <ExperienceLogo
                              logo={experience.logo}
                              alt={experience.institution || experience.company || experience.title}
                              size="small"
                            />
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4">
                          <div className={`flex-1 ${isIndividualLogo && experience.logo ? 'pr-16 md:pr-20' : ''}`}>
                            <h3
                              className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity"
                              style={{ color: 'var(--color-experience-title)' }}
                            >
                              {renderTitleWithStyledInstitution(experience)}
                            </h3>

                            {/* Duration/location for Education/Other individual items */}
                            {isIndividualLogo && (experience.duration || experience.location) && (
                              <p
                                className="text-sm font-semibold mb-3"
                                style={{ color: 'var(--color-primary)', opacity: 0.8 }}
                              >
                                {experience.duration && <span>{experience.duration}</span>}
                                {experience.duration && experience.location && (
                                  <span className="mx-2">•</span>
                                )}
                                {experience.location && <span>{experience.location}</span>}
                              </p>
                            )}

                            <p
                              className="text-base mb-4"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {experience.summary}
                            </p>

                            {/* Highlights */}
                            {experience.highlights && experience.highlights.length > 0 && (
                              <ul className="space-y-1 text-sm mb-4" style={{ color: 'var(--color-primary)' }}>
                                {experience.highlights.slice(0, 3).map((highlight) => (
                                  <li key={highlight} className="flex gap-2">
                                    <span>•</span>
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Tech Stack Tags */}
                            {experience.techStack && experience.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {experience.techStack.slice(0, 5).map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 rounded-full text-xs"
                                    style={{
                                      backgroundColor: 'var(--color-card-bg)',
                                      border: '1px solid var(--color-primary)',
                                      color: 'var(--color-primary)',
                                      opacity: 0.9,
                                    }}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
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
                </section>
              );
            })}

            {/* CTA Section */}
            <div className="card px-6 py-4 text-center mt-12">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Work With Me
              </h3>
              <p
                className="mb-3 max-w-3xl mx-auto text-sm leading-snug"
                style={{ color: 'var(--color-primary)' }}
              >
                I bring hands-on experience delivering production MLOps and GenAI systems at moderate scale—with minimal infrastructure footprint and cost-effective architectures. I&apos;m excited to collaborate on building next-generation Agentic AI systems. Whether you need expertise in MLOps, GenAI, or Agentic AI—let&apos;s connect.
              </p>
              <Link href="/contact" className="btn-primary inline-block text-sm px-5 py-2">
                Contact Me
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
