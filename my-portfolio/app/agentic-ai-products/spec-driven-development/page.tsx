import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Spec Driven Development | Agentic AI Products',
        description: 'Using structured specifications as the source of truth for both humans and AI coding agents.',
    };
}

export default async function SpecDrivenDevelopmentPage() {
    const content = await getAgenticAIProductBySlug('spec_driven_development_using_coding_agents/spec_driven_development');

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/agentic-ai-products"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Agentic AI Products
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <AgenticAINavSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl product-body">
                        {/* Header */}
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Spec Driven Development
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Using structured specifications as the source of truth for both humans and AI coding agents.
                            </p>
                        </header>

                        {/* Content */}
                        {content && (
                            <article
                                className="markdown-body"
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
