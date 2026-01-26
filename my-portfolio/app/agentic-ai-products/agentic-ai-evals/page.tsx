import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';

export async function generateMetadata() {
    return {
        title: 'Evaluation of AI Agents | Agentic AI Products',
        description: 'Comprehensive framework for evaluating agent behavior over time. Master the 6-dimension scorecard, grader types, and 3-tier pipeline for production-ready eval systems.',
    };
}

const subSections = [
    {
        id: 'playbook',
        title: 'Evaluation Playbook',
        description: 'Complete CTO/Tech-Lead guide with 20 sections covering evaluation strategy, metrics, grader types, and implementation roadmap.',
        href: '/agentic-ai-products/agentic-ai-evals/playbook',
        icon: '📖',
        highlights: ['Mental model', '6-dimension scorecard', 'Grader types', '8-step roadmap'],
    },
    {
        id: 'framework',
        title: 'Evaluation Framework',
        description: 'YAML-based task suite structure with schemas, configuration, and suite breakdown for golden, open-ended, adversarial, and failure-replay tests.',
        href: '/agentic-ai-products/agentic-ai-evals/framework',
        icon: '🏗️',
        highlights: ['Task schema', 'Suite types', 'Config structure', 'Execution flow'],
    },
    {
        id: 'rubrics',
        title: 'Scoring Rubrics',
        description: 'Three standardized 0-4 scoring rubrics for evaluating trajectory quality, safety policy adherence, and output quality.',
        href: '/agentic-ai-products/agentic-ai-evals/rubrics',
        icon: '📝',
        highlights: ['Trajectory quality', 'Safety policy', 'Output quality', '0-4 scale'],
    },
    {
        id: 'tasks',
        title: 'Example Tasks',
        description: 'Four categorized evaluation tasks demonstrating golden tests, open-ended evals, adversarial testing, and failure replay patterns.',
        href: '/agentic-ai-products/agentic-ai-evals/tasks',
        icon: '🎯',
        highlights: ['Golden suite', 'Open-ended', 'Adversarial', 'Failure replays'],
    },
];

export default function AgenticAIEvalsPage() {
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
                    <div className="flex-1 max-w-4xl">
                        {/* Hero Header */}
                        <header className="mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Evaluation of AI Agents
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Evaluate agent behavior over time, not just answers. A comprehensive framework for building production-ready evaluation systems.
                            </p>

                            {/* Key Concepts Grid */}
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">6-Dimension Scorecard</h3>
                                    <p className="text-sm text-muted-foreground">Correctness, trajectory, safety, robustness, efficiency, UX</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">3 Grader Types</h3>
                                    <p className="text-sm text-muted-foreground">Deterministic tests, model-based rubrics, human judgment</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">3-Tier Pipeline</h3>
                                    <p className="text-sm text-muted-foreground">CI gates, nightly runs, release candidate validation</p>
                                </div>
                            </div>
                        </header>

                        {/* Framework Overview */}
                        <div className="mb-12 bg-muted/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-4">Why This Framework?</h2>
                            <p className="text-muted-foreground mb-4">
                                Traditional eval systems focus on single-turn correctness. This framework addresses the unique challenges of evaluating agentic systems:
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong>Long-horizon behavior:</strong> Agents make multiple decisions over time, not just one answer</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong>Tool interactions:</strong> Evaluate how agents use tools, not just final outputs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong>Safety & robustness:</strong> Test adversarial scenarios and edge cases</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">•</span>
                                    <span><strong>Production incidents:</strong> Replay failures as regression tests</span>
                                </li>
                            </ul>
                        </div>

                        {/* Sub-Sections Navigation */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Explore the Framework</h2>
                            {subSections.map((section) => (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className="block bg-muted/10 hover:bg-muted/20 rounded-2xl p-6 md:p-8 transition-colors border border-transparent hover:border-primary/20"
                                >
                                    <div className="flex gap-4 md:gap-6">
                                        <div className="text-3xl md:text-4xl flex-shrink-0">{section.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl md:text-2xl font-bold mb-2">{section.title}</h3>
                                            <p className="text-muted-foreground mb-4">{section.description}</p>

                                            {section.highlights && (
                                                <div className="flex flex-wrap gap-2">
                                                    {section.highlights.map((highlight) => (
                                                        <span
                                                            key={highlight}
                                                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                                        >
                                                            {highlight}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0 self-center text-muted-foreground">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
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
