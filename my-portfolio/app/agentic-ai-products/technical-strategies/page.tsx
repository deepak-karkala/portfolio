import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Technical Strategies & Architecture | Agentic AI Products',
        description: 'Production patterns for reliability, safety, evals, observability, and governance in AI agent systems.',
    };
}

export default async function TechnicalStrategiesPage() {
    const content = await getAgenticAIProductBySlug('tech/agentic_ai_technical_playbook_portfolio');

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
                                Technical Strategies & Architecture
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Production patterns for reliability, safety, evals, observability, and governance.
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
