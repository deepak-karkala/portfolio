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
        id: 'claude-agent-sdk',
        title: 'Claude Agent SDK',
        href: '/agentic-coding/claude-agent-sdk',
    },
    {
        id: 'claude-code-config',
        title: 'Configuration',
        href: '/agentic-coding/claude-code-config',
        subItems: [
            { id: 'everything', title: 'Everything Claude Code', href: '/agentic-coding/claude-code-config/everything-claude-code' },
            { id: 'oh-my', title: 'Oh My Claude Code', href: '/agentic-coding/claude-code-config/oh-my-claudecode' },
        ],
    },
    {
        id: 'claude-code-howto',
        title: 'How-To Guides',
        href: '/agentic-coding/claude-code-howto',
        subItems: [
            { id: 'effective', title: 'Effective Claude Code', href: '/agentic-coding/claude-code-howto/effective-claude-code' },
            { id: 'starter', title: 'Starter Kit', href: '/agentic-coding/claude-code-howto/claude-code-starter-kit' },
            { id: 'features', title: 'Features', href: '/agentic-coding/claude-code-howto/claude-code-features' },
        ],
    },
    {
        id: 'build-coding-agents',
        title: 'Build Coding Agents',
        href: '/agentic-coding/how-to-build-coding-agents',
        subItems: [
            { id: 'playbook', title: 'Complete Playbook', href: '/agentic-coding/how-to-build-coding-agents/how-to-build-coding-agents' },
            { id: 'learn', title: 'Learn Claude Code', href: '/agentic-coding/how-to-build-coding-agents/learn-claude-code' },
        ],
    },
    {
        id: 'spec-driven-dev',
        title: 'Spec-Driven Development',
        href: '/agentic-coding/spec-driven-development',
        subItems: [
            { id: 'framework', title: 'Framework & Patterns', href: '/agentic-coding/spec-driven-development/spec-driven-dev-coding-agents' },
            { id: 'sisyphus', title: 'Sisyphus Framework', href: '/agentic-coding/spec-driven-development/oh-my-opencode-sisyphus-framework' },
        ],
    },
];

export default function AgenticCodingNavSidebar() {
    const pathname = usePathname();
    const isMainPage = pathname === '/agentic-coding';

    return (
        <div className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
            <nav className="space-y-1">
                <Link
                    href={isMainPage ? '/' : '/agentic-coding'}
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
