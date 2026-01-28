import Link from 'next/link';
import Image from 'next/image';
import { journeyItems, JourneyItem } from '@/lib/journeyData';

interface JourneyCardProps {
  item: JourneyItem;
}

function JourneyCard({ item }: JourneyCardProps) {
  return (
    <Link href={`/experiences/${item.slug}`} className={`journey-card category-${item.category}`}>
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md">
          <Image
            src={item.logo}
            alt={`${item.company} logo`}
            width={80}
            height={80}
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Company Name */}
      <h3 className="text-xl font-bold text-center mb-1" style={{ color: 'var(--color-foreground)' }}>
        {item.company}
      </h3>

      {/* Role */}
      <p className="text-sm font-medium text-center mb-2" style={{ color: 'var(--color-accent)' }}>
        {item.role}
      </p>

      {/* Duration & Location */}
      <div className="text-xs text-center mb-3" style={{ color: 'var(--color-primary)' }}>
        <p>{item.duration}</p>
        <p>{item.location}</p>
      </div>

      {/* Highlight */}
      <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--color-foreground)', opacity: 0.8 }}>
        {item.highlight}
      </p>

      {/* Category Badge */}
      <div className="mt-4 flex justify-center">
        <span
          className="text-xs px-3 py-1 rounded-full capitalize font-medium"
          style={{
            backgroundColor: getCategoryColor(item.category),
            color: 'white'
          }}
        >
          {item.category}
        </span>
      </div>
    </Link>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'education':
      return '#3B82F6';
    case 'work':
      return '#10B981';
    case 'research':
      return '#8B5CF6';
    case 'venture':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
}

export default function JourneyCards() {
  const getLatestYear = (duration: string): number => {
    const match = duration.match(/(\d{4})(?!.*\d{4})/);
    return match ? Number(match[1]) : 0;
  };

  const sortedItems = [...journeyItems].sort(
    (a, b) => getLatestYear(b.duration) - getLatestYear(a.duration)
  );

  return (
    <div className="relative px-4 md:px-8">
      <div className="journey-cards-container">
        {sortedItems.map((item) => (
          <JourneyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
