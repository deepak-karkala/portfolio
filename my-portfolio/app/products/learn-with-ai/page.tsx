import { getProductBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductSidebar from '@/components/ProductSidebar';
import ProfileLinks from '@/components/ProfileLinks';

// External Link Icon Component
function ExternalLinkIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
        </svg>
    );
}

// Rocket Icon Component for CTA
function RocketIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
        </svg>
    );
}

export async function generateMetadata() {
    const product = await getProductBySlug('learn-with-ai');
    if (!product) return {};
    return {
        title: `${product.title} | Products`,
        description: product.summary,
    };
}

export default async function LearnWithAIPage() {
    const product = await getProductBySlug('learn-with-ai');

    if (!product) {
        notFound();
    }

    const sections = [
        { id: 'the-challenge', title: 'The Challenge' },
        { id: 'see-it-in-action', title: 'See It In Action' },
        { id: 'core-capabilities', title: 'Core Capabilities' },
        { id: 'system-architecture', title: 'System Architecture' },
        { id: 'engineering-deep-dives', title: 'Engineering Deep Dives' },
        { id: 'impact-scale', title: 'Impact & Scale' },
        { id: 'quick-start', title: 'Quick Start' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Products
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <ProductSidebar sections={sections} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl product-body pr-8 lg:pr-16">
                        {/* Header */}
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                {product.title}
                            </h1>

                            <p className="text-xl text-muted-foreground mb-8">
                                {product.summary}
                            </p>

                            {/* Tech Stack */}
                            {product.techStack && product.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {product.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                {/* Primary CTA - Try Learn With AI */}
                                {product.externalUrl && (
                                    <a
                                        href={product.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        Try Live Demo
                                        <RocketIcon />
                                    </a>
                                )}
                                {/* GitHub Button */}
                                {product.githubUrl && (
                                    <a
                                        href={product.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        View on GitHub
                                        <GitHubIcon />
                                    </a>
                                )}
                                {/* Documentation Button */}
                                {product.docsUrl && (
                                    <a
                                        href={product.docsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        Documentation
                                        <ExternalLinkIcon />
                                    </a>
                                )}
                            </div>
                        </header>

                        {/* Main Content - Render markdown HTML */}
                        <article
                            className="markdown-body"
                            dangerouslySetInnerHTML={{ __html: product.content }}
                        />

                        {/* Profile Links */}
                        <ProfileLinks />
                    </div>
                </div>
            </div>
        </div>
    );
}
