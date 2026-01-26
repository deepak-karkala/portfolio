import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import { getAgenticAIProductBySlug } from '@/lib/content';
import RubricsTabsClient from './RubricsTabsClient';

export async function generateMetadata() {
    return {
        title: 'Scoring Rubrics | Agentic AI Evals',
        description: 'Three standardized 0-4 scoring rubrics for evaluating trajectory quality, safety policy adherence, and output quality.',
    };
}

export default async function ScoringRubricsPage() {
    // Load all three rubrics server-side
    const trajectoryRubric = await getAgenticAIProductBySlug('agentic_ai_evals/evals/_shared/rubrics/trajectory_quality');
    const safetyRubric = await getAgenticAIProductBySlug('agentic_ai_evals/evals/_shared/rubrics/safety_policy');
    const outputRubric = await getAgenticAIProductBySlug('agentic_ai_evals/evals/_shared/rubrics/output_quality');

    const rubrics = [
        {
            id: 'trajectory',
            title: 'Trajectory Quality',
            description: 'Evaluates the path taken by the agent to reach a solution',
            content: trajectoryRubric?.content || '<p>Content not found.</p>',
        },
        {
            id: 'safety',
            title: 'Safety Policy',
            description: 'Evaluates policy adherence and injection resistance',
            content: safetyRubric?.content || '<p>Content not found.</p>',
        },
        {
            id: 'output',
            title: 'Output Quality',
            description: 'Evaluates the quality of the final output',
            content: outputRubric?.content || '<p>Content not found.</p>',
        },
    ];

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
                    <div className="flex-1 max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Scoring Rubrics
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Three standardized 0-4 scoring rubrics for evaluating different aspects of agent performance.
                            </p>
                        </header>

                        {/* Client-side tabs component */}
                        <RubricsTabsClient rubrics={rubrics} />
                    </div>
                </div>
            </div>
        </div>
    );
}
