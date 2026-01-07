import Link from 'next/link';
import { getVentures } from '@/lib/content';

export const metadata = {
    title: 'Ventures | Deepak Karkala',
    description: 'Entrepreneurial ventures focused on social impact and innovation',
};

export default async function VenturesPage() {
    const ventures = await getVentures();

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Entrepreneurial Ventures</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Social impact initiatives and entrepreneurial projects aimed at solving meaningful problems
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ventures.map((venture) => (
                        <Link
                            key={venture.slug}
                            href={`/ventures/${venture.slug}`}
                            className="group block h-full"
                        >
                            <article className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                                {venture.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={venture.image}
                                            alt={venture.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-3">
                                        {venture.category && (
                                            <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                                                {venture.category}
                                            </span>
                                        )}
                                        {venture.status && (
                                            <span
                                                className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ${
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
                                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {venture.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                        {venture.summary}
                                    </p>
                                    {venture.location && (
                                        <p className="text-xs text-muted-foreground mt-auto">
                                            📍 {venture.location}
                                        </p>
                                    )}
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
