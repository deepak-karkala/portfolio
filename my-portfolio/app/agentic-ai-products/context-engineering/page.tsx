import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Context Engineering | Agentic AI Products',
        description: 'The art and science of curating, compressing, and delivering the right context to AI agents.',
    };
}

export default async function ContextEngineeringPage() {
    const content = await getAgenticAIProductBySlug('context_engineering/context_engineering_playbook');

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
                                Context Engineering
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                The art and science of curating, compressing, and delivering the right context to AI agents.
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
