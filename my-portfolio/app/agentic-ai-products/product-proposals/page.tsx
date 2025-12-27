import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Flagship Product Proposals | Agentic AI Products',
        description: 'Six domain-specific proposals demonstrating full-spectrum competence: product wedge, engineering architecture, reliability, and governance.',
    };
}

export default async function ProductProposalsPage() {
    const overviewContent = await getAgenticAIProductBySlug('flagship_product_proposals/flagship_proposals_4_full');

    const products = [
        {
            id: 'writers-room-copilot',
            title: "Writer's Room Copilot",
            description: 'Script writing with multi-role critique and structured revision loops',
            href: '/agentic-ai-products/product-proposals/writers-room-copilot',
            color: 'border-purple-500',
            icon: '✍️',
        },
        {
            id: 'wealth-management-agent',
            title: 'Wealth Management Agent',
            description: 'Financial advisory with portfolio analysis and compliance guardrails',
            href: '/agentic-ai-products/product-proposals/wealth-management-agent',
            color: 'border-green-500',
            icon: '💰',
        },
        {
            id: 'retail-operations-agent',
            title: 'Retail Operations Agent',
            description: 'Inventory and trading optimization with real-time decision support',
            href: '/agentic-ai-products/product-proposals/retail-operations-agent',
            color: 'border-blue-500',
            icon: '🏪',
        },
        {
            id: 'founders-operating-system',
            title: "Founder's Operating System",
            description: 'Research, planning, and execution support for startup founders',
            href: '/agentic-ai-products/product-proposals/founders-operating-system',
            color: 'border-orange-500',
            icon: '🚀',
        },
        {
            id: 'mlops-agent',
            title: 'Agentic MLOps',
            description: 'End-to-end MLOps platform for designing and generating production-ready ML infrastructure',
            href: '/agentic-ai-products/product-proposals/mlops-agent',
            color: 'border-red-500',
            icon: '⚙️',
        },
        {
            id: 'homebuilder-copilot',
            title: 'Build My Home Copilot',
            description: 'Agentic home-building operating system for transparency and trust in construction',
            href: '/agentic-ai-products/product-proposals/homebuilder-copilot',
            color: 'border-yellow-500',
            icon: '🏠',
        },
    ];

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
                                Flagship Product Proposals
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Six domain-specific proposals demonstrating full-spectrum competence: product wedge, engineering architecture, reliability, and governance.
                            </p>

                            {/* Overview Content */}
                            {overviewContent && (
                                <div className="bg-muted/20 rounded-xl p-6 mb-8">
                                    <div
                                        className="markdown-body"
                                        dangerouslySetInnerHTML={{ __html: overviewContent.content }}
                                    />
                                </div>
                            )}
                        </header>

                        {/* Product Cards */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={product.href}
                                    className="group block"
                                >
                                    <div className={`relative bg-gradient-to-br from-muted/5 to-muted/20 hover:from-muted/10 hover:to-muted/30 rounded-2xl p-8 transition-all duration-300 border-2 border-muted/20 hover:border-muted/40 hover:shadow-xl hover:-translate-y-1`}>
                                        {/* Accent border on top */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${product.color.replace('border-', 'bg-')}`} />

                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-16 h-16 mb-6 text-5xl bg-muted/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            {product.icon}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[3rem]">
                                                {product.description}
                                            </p>

                                            {/* View Details Link */}
                                            <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                                                <span>View Details</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
