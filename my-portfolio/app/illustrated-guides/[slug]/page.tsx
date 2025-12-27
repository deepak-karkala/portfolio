import Link from 'next/link';
import { getIllustratedGuides, getIllustratedGuideBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';

// External Link Icon Component
function ExternalLinkIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
        </svg>
    );
}

// GitHub Icon Component
function GitHubIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
        </svg>
    );
}

export async function generateStaticParams() {
    const guides = await getIllustratedGuides();
    return guides.map((guide) => ({
        slug: guide.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const guide = await getIllustratedGuideBySlug(slug);
    if (!guide) return {};

    return {
        title: `${guide.title} | Illustrated Guides`,
        description: guide.summary,
    };
}

export default async function IllustratedGuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const guide = await getIllustratedGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Back link */}
                <Link
                    href="/illustrated-guides"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
                >
                    ← Back to Illustrated Guides
                </Link>

                {/* Title and category */}
                <div className="mb-8">
                    {guide.category && (
                        <p className="text-sm text-primary font-medium mb-2">{guide.category}</p>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
                    <p className="text-xl text-muted-foreground">{guide.summary}</p>
                </div>

                {/* CTA Buttons - Launch Interactive Guide & View Source */}
                {(guide.externalUrl || guide.githubUrl) && (
                    <div className="mb-12 flex flex-wrap gap-4">
                        {guide.externalUrl && (
                            <a
                                href={guide.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Launch Interactive Guide
                                <ExternalLinkIcon />
                            </a>
                        )}
                        {guide.githubUrl && (
                            <a
                                href={guide.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
                            >
                                View Source on GitHub
                                <GitHubIcon />
                            </a>
                        )}
                    </div>
                )}

                {/* Highlights */}
                {guide.highlights && guide.highlights.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                        <ul className="space-y-3">
                            {guide.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-primary mt-1">✓</span>
                                    <span className="text-muted-foreground">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Tech Stack */}
                {guide.techStack && guide.techStack.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
                        <div className="flex flex-wrap gap-2">
                            {guide.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content from markdown */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none mb-12 [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:font-semibold [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: guide.content }}
                />

                {/* Bottom CTA Buttons */}
                {(guide.externalUrl || guide.githubUrl) && (
                    <div className="border-t border-border pt-8 flex flex-wrap gap-4">
                        {guide.externalUrl && (
                            <a
                                href={guide.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Launch Interactive Guide
                                <ExternalLinkIcon />
                            </a>
                        )}
                        {guide.githubUrl && (
                            <a
                                href={guide.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
                            >
                                View Source on GitHub
                                <GitHubIcon />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
