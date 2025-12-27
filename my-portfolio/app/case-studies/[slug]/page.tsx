import { getCaseStudyBySlug, getCaseStudies } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/case-studies"
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Case Studies
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4">
            {caseStudy.category && (
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-foreground)'
                }}
              >
                {caseStudy.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
            {caseStudy.title}
          </h1>

          <p className="text-xl mb-6" style={{ color: 'var(--color-primary)' }}>
            {caseStudy.summary}
          </p>

          {caseStudy.highlights && caseStudy.highlights.length > 0 && (
            <ul className="mb-8 space-y-3 text-base" style={{ color: 'var(--color-primary)' }}>
              {caseStudy.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden="true">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'var(--color-primary)' }}>
            <div>
              <strong>Date:</strong> {caseStudy.date}
            </div>
            {caseStudy.techStack && caseStudy.techStack.length > 0 && (
              <div>
                <strong>Technologies:</strong> {caseStudy.techStack.join(', ')}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: caseStudy.content }}
        />

        {/* Tech Stack Section */}
        {caseStudy.techStack && caseStudy.techStack.length > 0 && (
          <section className="mt-12 p-6 card">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-3">
              {caseStudy.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-foreground)' }}>
            Other Case Studies
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* This would be populated with other case studies */}
            <Link href="/case-studies" className="card hover:shadow-lg transition-shadow">
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
                View All Case Studies
              </h4>
              <p style={{ color: 'var(--color-primary)' }}>
                Explore more examples of my work in ML, AI, and data engineering.
              </p>
            </Link>

            <Link href="/contact" className="card hover:shadow-lg transition-shadow">
              <h4 className="font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
                Discuss Your Project
              </h4>
              <p style={{ color: 'var(--color-primary)' }}>
                Have a similar challenge? Let&apos;s talk about how I can help.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
