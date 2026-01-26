import Link from 'next/link';
import AgenticCodingNavSidebar from '@/components/AgenticCodingNavSidebar';

export async function generateMetadata() {
    return {
        title: 'Agentic Coding | Building with AI Coding Agents',
        description: 'Comprehensive guides for building effective AI coding agents - Claude Code, Claude Agent SDK, configuration, patterns, and spec-driven development.',
    };
}

const sections = [
    {
        id: 'claude-agent-sdk',
        title: 'Claude Agent SDK',
        description: 'Production-ready agentic AI systems with built-in tools, governance, and deployment patterns',
        href: '/agentic-coding/claude-agent-sdk',
        icon: '🤖',
        highlights: ['State management', 'Built-in toolchain', 'Control plane', 'MCP extensions'],
    },
    {
        id: 'claude-code-config',
        title: 'Configuration & Setup',
        description: 'Complete reference for configuring Claude Code with advanced customization patterns',
        href: '/agentic-coding/claude-code-config',
        icon: '⚙️',
        highlights: ['Settings reference', 'Team workflows', 'Advanced patterns'],
    },
    {
        id: 'claude-code-howto',
        title: 'How-To Guides',
        description: 'Senior engineer mental models for composable primitives, slash commands, skills, and team workflows',
        href: '/agentic-coding/claude-code-howto',
        icon: '📚',
        highlights: ['Mental models', 'Prompting patterns', 'Composition recipes', 'Best practices'],
    },
    {
        id: 'build-coding-agents',
        title: 'Build Coding Agents',
        description: 'Complete playbook for building coding agents covering architecture, training, evals, and observability',
        href: '/agentic-coding/how-to-build-coding-agents',
        icon: '🏗️',
        highlights: ['Architecture patterns', 'Training pipelines', 'Evaluation systems', 'Observability'],
    },
    {
        id: 'spec-driven-dev',
        title: 'Spec-Driven Development',
        description: 'Control system designs for turning specs into incremental code changes safely and efficiently',
        href: '/agentic-coding/spec-driven-development',
        icon: '📋',
        highlights: ['Spec plane design', 'Execution loops', 'SDLC frameworks', 'Orchestration'],
    },
];

export default function AgenticCodingPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Home
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <AgenticCodingNavSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Hero Header */}
                        <header className="mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Agentic Coding
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                                A comprehensive guide to building effective AI coding agents. From configuration and best practices to building production-ready systems with the Claude Agent SDK.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Learning</h3>
                                    <p className="text-sm text-muted-foreground">Mental models, patterns, and best practices</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Configuration</h3>
                                    <p className="text-sm text-muted-foreground">Setup, customization, and team workflows</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Patterns</h3>
                                    <p className="text-sm text-muted-foreground">Architectural patterns and frameworks</p>
                                </div>
                            </div>
                        </header>

                        {/* Sections List */}
                        <div className="space-y-6">
                            {sections.map((section) => (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className="block bg-muted/10 hover:bg-muted/20 rounded-2xl p-6 md:p-8 transition-colors border border-transparent hover:border-primary/20"
                                >
                                    <div className="flex gap-4 md:gap-6">
                                        <div className="text-3xl md:text-4xl flex-shrink-0">{section.icon}</div>
                                        <div className="flex-1">
                                            <h2 className="text-xl md:text-2xl font-bold mb-2">{section.title}</h2>
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
