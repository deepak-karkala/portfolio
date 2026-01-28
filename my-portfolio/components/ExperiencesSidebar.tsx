'use client';

import Link from 'next/link';
import type { ContentItem } from '@/lib/content';

interface ExperiencesSidebarProps {
  experiences: ContentItem[];
  activeSlug?: string;
}

interface GroupedExperiences {
  category: string;
  items: ContentItem[];
}

function groupExperiences(experiences: ContentItem[]): GroupedExperiences[] {
  const groups = new Map<string, ContentItem[]>();

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
    'Other'
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

export default function ExperiencesSidebar({
  experiences,
  activeSlug
}: ExperiencesSidebarProps) {
  const groupedExperiences = groupExperiences(experiences);

  return (
    <div className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
      <nav className="space-y-1">
        <Link
          href="/"
          className="text-sm font-semibold mb-3 text-muted-foreground hover:text-foreground block"
          style={{ color: 'var(--color-primary)' }}
        >
          ← Back to Home
        </Link>
        <div className="border-t border-muted pt-3 mt-3" style={{ borderColor: 'var(--color-card-border)' }}>
          {groupedExperiences.map(({ category, items }) => {
            // Render category title
            return (
              <div key={category} className="mb-4">
                <div
                  className="block w-full text-left text-sm py-1.5 px-2 rounded font-medium"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {category}
                </div>

                {/* Items list with vertical line */}
                <div
                  className="ml-2 mt-1 space-y-0.5 border-l-2 pl-2"
                  style={{ borderColor: 'var(--color-card-border)' }}
                >
                  {items.map((experience) => {
                    const isActive = experience.slug === activeSlug;
                    return (
                      <Link
                        key={experience.slug}
                        href={`/experiences/${experience.slug}`}
                        className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${isActive
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
                        {experience.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
