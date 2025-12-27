'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubItem {
    id: string;
    title: string;
    href: string;
}

interface Section {
    id: string;
    title: string;
    href: string;
    subItems?: SubItem[];
}

const sections: Section[] = [
    {
        id: 'technical-strategies',
        title: 'Technical Strategies',
        href: '/agentic-ai-products/technical-strategies',
    },
    {
        id: 'product-business',
        title: 'Product & Business Strategy',
        href: '/agentic-ai-products/product-business',
    },
    {
        id: 'skills-mcp-subagents',
        title: 'Skills, MCP, Subagents',
        href: '/agentic-ai-products/skills-mcp-subagents',
    },
    {
        id: 'product-proposals',
        title: 'Product Proposals',
        href: '/agentic-ai-products/product-proposals',
        subItems: [
            { id: 'writers-room', title: "Writer's Room Copilot", href: '/agentic-ai-products/product-proposals/writers-room-copilot' },
            { id: 'wealth-management', title: 'Wealth Management Agent', href: '/agentic-ai-products/product-proposals/wealth-management-agent' },
            { id: 'retail-operations', title: 'Retail Operations Agent', href: '/agentic-ai-products/product-proposals/retail-operations-agent' },
            { id: 'founders-os', title: "Founder's OS", href: '/agentic-ai-products/product-proposals/founders-operating-system' },
            { id: 'mlops-agent', title: 'Agentic MLOps', href: '/agentic-ai-products/product-proposals/mlops-agent' },
            { id: 'homebuilder-copilot', title: 'Build My Home Copilot', href: '/agentic-ai-products/product-proposals/homebuilder-copilot' },
        ],
    },
    {
        id: 'context-engineering',
        title: 'Context Engineering',
        href: '/agentic-ai-products/context-engineering',
    },
    {
        id: 'spec-driven-development',
        title: 'Spec Driven Development',
        href: '/agentic-ai-products/spec-driven-development',
    },
];

export default function AgenticAINavSidebar() {
    const pathname = usePathname();
    const isMainPage = pathname === '/agentic-ai-products';

    return (
        <div className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
            <nav className="space-y-1">
                <Link
                    href={isMainPage ? '/' : '/agentic-ai-products'}
                    className="text-sm font-semibold mb-3 text-muted-foreground hover:text-foreground block"
                >
                    {isMainPage ? '← Home' : '← All Sections'}
                </Link>
                <div className="border-t border-muted pt-3 mt-3">
                    {sections.map((section) => (
                        <div key={section.id}>
                            <Link
                                href={section.href}
                                className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                                    pathname === section.href
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                                {section.title}
                            </Link>
                            {section.subItems && (
                                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-muted pl-2">
                                    {section.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.id}
                                            href={subItem.href}
                                            className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                                                pathname === subItem.href
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                            }`}
                                        >
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
}
