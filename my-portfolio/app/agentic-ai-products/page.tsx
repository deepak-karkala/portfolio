import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';

export async function generateMetadata() {
    return {
        title: 'Building Effective AI Agents | Agentic AI Products',
        description: 'Comprehensive playbooks and strategies for building production-ready AI agents - technical architecture, product strategy, context engineering, and flagship product proposals.',
    };
}

const sections = [
    {
        id: 'technical-strategies',
        title: 'Technical Strategies & Architecture',
        description: 'Production patterns for reliability, safety, evals, observability, and governance. Learn how to ship the smallest agent that solves the job while keeping it safe, observable, and governable.',
        href: '/agentic-ai-products/technical-strategies',
        icon: '⚙️',
        highlights: ['Orchestration patterns', 'Tool design (ACI)', 'Guardrails & HITL', 'Evals pipeline'],
    },
    {
        id: 'product-business',
        title: 'Product & Business Strategy',
        description: 'How to pick winning agent wedges, design adoption + distribution loops, price safely, and govern rollout. Build agentic products that ship, stick, and scale.',
        href: '/agentic-ai-products/product-business',
        icon: '📈',
        highlights: ['7-step AI Strategic Lens', 'Moats: data, distribution, trust', 'Unit economics', 'Safe rollout'],
    },
    {
        id: 'skills-mcp-subagents',
        title: 'Skills, MCP, Context & Subagents',
        description: 'Building blocks for agentic AI workflows. Understand the 4 layers of architecture and when to use skills, subagents, MCP servers, or simple context.',
        href: '/agentic-ai-products/skills-mcp-subagents',
        icon: '🧩',
        highlights: ['4-layer architecture', 'Decision tree', 'MCP integration', 'Subagent orchestration'],
    },
    {
        id: 'product-proposals',
        title: 'Flagship Product Proposals',
        description: 'Four domain-specific proposals demonstrating full-spectrum competence: product wedge, engineering architecture, reliability, and governance.',
        href: '/agentic-ai-products/product-proposals',
        icon: '🚀',
        subItems: [
            { title: "Writer's Room Copilot", description: 'Script writing with multi-role critique', color: 'border-purple-500' },
            { title: 'Wealth Management Agent', description: 'Financial advisory with compliance guardrails', color: 'border-green-500' },
            { title: 'Retail Operations Agent', description: 'Inventory and trading optimization', color: 'border-blue-500' },
            { title: "Founder's Operating System", description: 'Research and execution support', color: 'border-orange-500' },
        ],
    },
    {
        id: 'context-engineering',
        title: 'Context Engineering',
        description: 'The art and science of curating, compressing, and delivering the right context to AI agents. Master the 4 knobs: Write, Select, Compress, Isolate.',
        href: '/agentic-ai-products/context-engineering',
        icon: '🎯',
        highlights: ['Context as compiled view', '4 knobs framework', 'Failure modes', 'Governance posture'],
    },
    {
        id: 'spec-driven-development',
        title: 'Spec Driven Development',
        description: 'Using structured specifications as the source of truth for both humans and AI coding agents. Compare frameworks like BMAD, Spec-Kit, AWS Kiro, and more.',
        href: '/agentic-ai-products/spec-driven-development',
        icon: '📋',
        highlights: ['Framework comparison', 'Autonomy spectrum', 'Methodology patterns', 'When to use each'],
    },
];

export default function AgenticAIProductsPage() {
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
                        <AgenticAINavSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Hero Header */}
                        <header className="mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Building Effective AI Agents
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                                A comprehensive showcase of technical, product, and business expertise in designing and deploying production-ready AI agent systems.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Technical</h3>
                                    <p className="text-sm text-muted-foreground">Architecture, reliability, observability, evals</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Product</h3>
                                    <p className="text-sm text-muted-foreground">Strategy, UX, distribution, pricing</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Business</h3>
                                    <p className="text-sm text-muted-foreground">Governance, trust, rollout, moats</p>
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

                                            {section.subItems && (
                                                <div className="grid md:grid-cols-2 gap-3 mt-4">
                                                    {section.subItems.map((item) => (
                                                        <div
                                                            key={item.title}
                                                            className={`bg-background/50 rounded-lg p-3 border-l-4 ${item.color}`}
                                                        >
                                                            <h4 className="font-semibold text-sm">{item.title}</h4>
                                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                                        </div>
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
