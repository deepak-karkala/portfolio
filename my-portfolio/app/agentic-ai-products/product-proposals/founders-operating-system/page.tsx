import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: "Founder's Operating System | Product Proposals",
        description: 'Research, planning, and execution support for startup founders',
    };
}

export default async function FoundersOperatingSystemPage() {
    const content = await getAgenticAIProductBySlug('flagship_product_proposals/founder/product_description');

    const uiMockups = [
        { name: 'project_workspace.png', title: 'Project Workspace' },
        { name: 'chat_interface.png', title: 'Chat Interface' },
        { name: 'artifacts_management.png', title: 'Artifacts Management' },
        { name: 'experiment_tracker.png', title: 'Experiment Tracker' },
        { name: 'trust_ui_citations_approvals.png', title: 'Trust UI: Citations & Approvals' },
    ];

    // Split content at "## 2)" to insert architecture and mockups after Executive snapshot
    let beforeSection2 = '';
    let afterSection2 = '';

    if (content?.content) {
        const splitPoint = content.content.indexOf('<h2>2) Product experience');
        if (splitPoint !== -1) {
            beforeSection2 = content.content.substring(0, splitPoint);
            afterSection2 = content.content.substring(splitPoint);
        } else {
            beforeSection2 = content.content;
        }
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/agentic-ai-products/product-proposals"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Product Proposals
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
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">🚀</span>
                                <h1 className="text-4xl md:text-5xl font-bold">
                                    Founder&apos;s Operating System
                                </h1>
                            </div>
                            <p className="text-xl text-muted-foreground">
                                Research, planning, and execution support for startup founders
                            </p>
                        </header>

                        {/* Product Description - Part 1 (up to Executive snapshot) */}
                        {beforeSection2 && (
                            <article
                                className="markdown-body mb-16"
                                dangerouslySetInnerHTML={{ __html: beforeSection2 }}
                            />
                        )}

                        {/* Technical Architecture */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-6">Technical Architecture</h2>
                            <div className="bg-muted/20 rounded-xl p-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/agentic-ai-products/flagship_product_proposals/founder/technical_architecture.png"
                                    alt="Founder's Operating System Technical Architecture"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </section>

                        {/* UI Mockups */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-6">UI Mockups</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {uiMockups.map((mockup) => (
                                    <div key={mockup.name} className="bg-muted/20 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold mb-3">{mockup.title}</h3>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`/agentic-ai-products/flagship_product_proposals/founder/ui_mockups/${mockup.name}`}
                                            alt={mockup.title}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Product Description - Part 2 (rest of content) */}
                        {afterSection2 && (
                            <article
                                className="markdown-body mb-16"
                                dangerouslySetInnerHTML={{ __html: afterSection2 }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
