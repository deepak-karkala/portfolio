import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Evaluation Playbook | Agentic AI Evals',
        description: 'Complete CTO/Tech-Lead guide for evaluating AI agents. Covers mental models, scorecard frameworks, grader types, and implementation roadmaps.',
    };
}

export default async function EvaluationPlaybookPage() {
    const content = await getAgenticAIProductBySlug('agentic_ai_evals/evaluation-of-ai-agents');

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/agentic-ai-products/agentic-ai-evals"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Evaluation Framework
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
                                Evaluation Playbook
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                A comprehensive guide for CTOs and tech leads on evaluating AI agent systems in production.
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
