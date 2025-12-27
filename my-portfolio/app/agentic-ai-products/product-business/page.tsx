import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Product & Business Strategy | Agentic AI Products',
        description: 'How to pick winning agent wedges, design adoption + distribution loops, price safely, and govern rollout.',
    };
}

export default async function ProductBusinessPage() {
    const content = await getAgenticAIProductBySlug('product/agentic_ai_product_business_playbook_portfolio');

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
                                Product & Business Strategy
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                How to pick winning agent wedges, design adoption + distribution loops, price safely, and govern rollout.
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
