import Link from 'next/link';
import AgenticCodingNavSidebar from '@/components/AgenticCodingNavSidebar';

export async function generateMetadata() {
    return {
        title: 'Build Coding Agents | Agentic Coding',
        description: 'Complete playbook for building coding agents covering architecture, training, evals, and observability',
    };
}

const articles = [
    {
        id: 'how-to-build-coding-agents',
        title: 'How to Build Coding Agents',
        description: 'Complete playbook covering architecture, training, evals, and observability',
        href: '/agentic-coding/how-to-build-coding-agents/how-to-build-coding-agents',
        icon: '📘',
        color: 'border-orange-500',
    },
    {
        id: 'learn-claude-code',
        title: 'Learn Claude Code',
        description: 'Progressive implementation tutorial and educational deep-dive',
        href: '/agentic-coding/how-to-build-coding-agents/learn-claude-code',
        icon: '🎓',
        color: 'border-green-500',
    },
];

export default function BuildCodingAgentsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/agentic-coding"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Agentic Coding
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <AgenticCodingNavSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        <header className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">🏗️</span>
                                <h1 className="text-4xl font-bold">Build Coding Agents</h1>
                            </div>
                            <p className="text-xl text-muted-foreground">
                                Complete playbook for building coding agents covering architecture, training, evals, and observability
                            </p>
                        </header>

                        {/* Articles Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={article.href}
                                    className="group block"
                                >
                                    <div className="relative bg-gradient-to-br from-muted/5 to-muted/20 hover:from-muted/10 hover:to-muted/30 rounded-2xl p-8 transition-all">
                                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${article.color.replace('border-', 'bg-')}`} />
                                        <div className="text-5xl mb-6">{article.icon}</div>
                                        <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-6">{article.description}</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                            <span>Read More</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
