import JourneyCards from './JourneyCards';

export default function JourneySection() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
          My Journey
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'var(--color-primary)' }}>
          A 15-year journey across research, startups, and production ML systems
        </p>
        <p className="text-sm" style={{ color: 'var(--color-primary)', opacity: 0.6 }}>
          ← Scroll to explore my journey →
        </p>
      </div>

      {/* Card Layout */}
      <div className="max-w-7xl mx-auto">
        <JourneyCards />
      </div>
    </section>
  );
}
