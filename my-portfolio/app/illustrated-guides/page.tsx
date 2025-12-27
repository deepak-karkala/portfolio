import Link from 'next/link';
import { getIllustratedGuides } from '@/lib/content';

export const metadata = {
    title: 'Illustrated Guides | My Portfolio',
    description: 'Interactive educational platforms making complex AI concepts intuitive through visualizations and hands-on learning.',
};

export default async function IllustratedGuidesPage() {
    const guides = await getIllustratedGuides();

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Illustrated Guides</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Interactive educational platforms that make complex AI concepts intuitive through visualizations, hands-on experiments, and narrative-driven learning.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {guides.map((guide) => (
                        <Link
                            key={guide.slug}
                            href={`/illustrated-guides/${guide.slug}`}
                            className="group block h-full"
                        >
                            <article className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                                {guide.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={guide.image}
                                            alt={guide.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {guide.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                        {guide.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {guide.techStack?.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {guide.techStack && guide.techStack.length > 3 && (
                                            <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                +{guide.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
