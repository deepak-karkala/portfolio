import Link from 'next/link';

interface ContentItem {
  title: string;
  description: string;
  link: string;
}

interface ContentSection {
  title: string;
  icon: string;
  items: ContentItem[];
  showViewAll?: boolean;
  viewAllLink?: string;
}

function ContentSection({ section }: { section: ContentSection }) {
  return (
    <div className="home-content-section">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-section-heading)' }}>
        {section.icon} {section.title}
      </h2>

      <ul className="home-content-list">
        {section.items.map((item, idx) => (
          <li key={idx} className="home-content-item">
            <Link href={item.link} className="block group">
              <span className="item-title font-semibold transition-colors">{item.title}</span>
              <span className="separator text-gray-400 mx-2"> → </span>
              <span className="item-description">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      {section.showViewAll && section.viewAllLink && (
        <Link
          href={section.viewAllLink}
          className="mt-4 inline-block text-sm font-medium"
          style={{ color: 'var(--color-accent)' }}
        >
          View All →
        </Link>
      )}
    </div>
  );
}

export default function HomeContentList({
  sections
}: {
  sections: ContentSection[]
}) {
  return (
    <section className="max-w-4xl mx-auto space-y-8 mt-16">
      {sections.map((section, idx) => (
        <ContentSection key={idx} section={section} />
      ))}
    </section>
  );
}
