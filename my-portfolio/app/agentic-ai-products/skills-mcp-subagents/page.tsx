import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Skills, MCP, Context & Subagents | Agentic AI Products',
        description: 'Building blocks for agentic AI workflows: skills, tools, context engineering, and subagent orchestration.',
    };
}

export default async function SkillsMCPSubagentsPage() {
    const content = await getAgenticAIProductBySlug('skills_subagents/agentic_workflows_skills_mcp_subagents_portfolio_layout');

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
                                Skills, MCP, Context & Subagents
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Building blocks for agentic AI workflows: skills, tools, context engineering, and subagent orchestration.
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
