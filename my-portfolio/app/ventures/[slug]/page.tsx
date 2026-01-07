import { getVentureBySlug, getVentures } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VentureNav from '@/components/VentureNav';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const ventures = await getVentures();
  return ventures.map((venture) => ({
    slug: venture.slug,
  }));
}

export default async function VenturePage({ params }: Props) {
  const { slug } = await params;
  const venture = await getVentureBySlug(slug);

  if (!venture) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/ventures"
            className="text-sm text-muted-foreground hover:opacity-80 transition-opacity"
          >
            ← Back to Ventures
          </Link>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation - Hidden on mobile, visible on md+ screens */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <VentureNav />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-12">
              <div className="mb-4 flex flex-wrap gap-2">
                {venture.category && (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'white'
                    }}
                  >
                    {venture.category}
                  </span>
                )}
                {venture.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      venture.status === 'Active'
                        ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                        : venture.status === 'On Hold'
                        ? 'bg-orange-200 text-orange-950 border border-orange-400 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700'
                        : 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                    }`}
                  >
                    {venture.status}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {venture.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {venture.summary}
              </p>

              {venture.highlights && venture.highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Key Highlights
                  </h3>
                  <ul className="space-y-3 text-base text-muted-foreground">
                    {venture.highlights.map((highlight, index) => (
                      <li key={index} className="flex gap-3">
                        <span aria-hidden="true">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {venture.location && (
                  <div>
                    <strong>📍 Location:</strong> {venture.location}
                  </div>
                )}
                {venture.role && (
                  <div>
                    <strong>👤 Role:</strong> {venture.role}
                  </div>
                )}
                {venture.websiteUrl && (
                  <div>
                    <strong>🌐 Website:</strong>{' '}
                    <a
                      href={venture.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {venture.websiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </header>

            {/* Main Content with smooth scrolling */}
            <article
              className="markdown-body scroll-smooth"
              dangerouslySetInnerHTML={{ __html: venture.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
