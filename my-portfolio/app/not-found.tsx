import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
          Page Not Found
        </h2>
        <p className="text-xl mb-8" style={{ color: 'var(--color-primary)' }}>
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
