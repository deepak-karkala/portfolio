import { getCaseStudies } from '@/lib/content';
import Link from 'next/link';

function groupCaseStudies(caseStudies: Awaited<ReturnType<typeof getCaseStudies>>) {
  const groups = new Map<string, typeof caseStudies>();

  caseStudies.forEach((study) => {
    const key = study.category || 'Other';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(study);
  });

  const order = ['IoT & Energy', 'E-commerce', 'Other'];

  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    })
    .map(([category, items]) => ({
      category,
      items: [...items].sort((a, b) => (a.date > b.date ? -1 : 1)),
    }));
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();
  const groupedCaseStudies = groupCaseStudies(caseStudies);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            Case Studies
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--color-primary)'}}>
            Deep-dive into my professional industry experience with quantifiable impact, 
            technical solutions, and architectural insights from real-world ML systems.
          </p>
        </section>

        {/* Case Studies Timeline */}
        <section className="space-y-16">
          {groupedCaseStudies.length > 0 ? (
            groupedCaseStudies.map((group) => (
              <div key={group.category}>
                <header className="mb-6">
                  <h2 className="text-2xl font-bold uppercase tracking-widest" style={{color: 'var(--color-secondary)'}}>
                    {group.category}
                  </h2>
                </header>
                <div
                  className="space-y-12 md:pl-12 md:border-l"
                  style={{borderColor: 'var(--color-secondary)'}}
                >
                  {group.items.map((study) => (
                  <article
                    key={study.slug}
                    className="relative flex flex-col md:flex-row gap-6 p-6 card hover:shadow-lg transition-all duration-300 md:pl-8"
                  >
                    {/* Timeline dot */}
                  <span
                    aria-hidden="true"
                    className="hidden md:inline-flex absolute top-6 h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      left: 'calc(-3rem - 0.375rem)',
                    }}
                  />

                  {/* Meta column */}
                  <div className="md:w-48 md:flex-shrink-0">
                    <p className="text-sm uppercase tracking-wide mb-2" style={{color: 'var(--color-primary)'}}>
                      {study.date}
                    </p>
                  </div>

                  {/* Content column */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--color-foreground)'}}>
                      {study.title}
                    </h3>
                    <p className="mb-4 text-base" style={{color: 'var(--color-primary)'}}>
                      {study.summary}
                    </p>

                    {study.highlights && study.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{color: 'var(--color-secondary)'}}>
                          Key Contributions
                        </h4>
                        <ul className="space-y-2 text-sm" style={{color: 'var(--color-primary)'}}>
                          {study.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-3">
                              <span aria-hidden="true">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {study.techStack && study.techStack.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2 text-xs" style={{color: 'var(--color-primary)'}}>
                        {study.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded-full border"
                            style={{borderColor: 'var(--color-secondary)'}}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="inline-flex items-center text-sm font-medium gap-2"
                      style={{color: 'var(--color-accent)'}}
                    >
                      Read full case study <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
                Case Studies Coming Soon
              </h3>
              <p style={{color: 'var(--color-primary)'}}>
                I&apos;m currently preparing detailed case studies from my professional experience. 
                Check back soon for in-depth technical insights!
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 p-8 card">
          <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            Want to discuss a similar project?
          </h3>
          <p className="mb-6" style={{color: 'var(--color-primary)'}}>
            I&apos;m available for consulting and technical advisory roles. Let&apos;s chat about your ML challenges.
          </p>
          <Link href="/contact" className="btn-primary">
            Get in Touch
          </Link>
        </section>
      </div>
    </div>
  );
} 
