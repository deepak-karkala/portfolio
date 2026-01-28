import Link from 'next/link';
import React from 'react';

interface LinkItem {
    label: string;
    href: string;
}

interface GridItem {
    title: string;
    items: LinkItem[];
    mainLink: string;
    icon: React.ReactNode;
    colorClass: string;
}

const sections: GridItem[] = [
    {
        title: 'Building Agentic AI Products',
        mainLink: '/agentic-ai-products',
        colorClass: 'bg-blue-100 text-blue-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M16.5 7.5h-9v9h9v-9z" opacity="0.3" />
                <path d="M21.75 12a.75.75 0 00-1.5 0 5.25 5.25 0 01-10.5 0 .75.75 0 00-1.5 0 6.75 6.75 0 0013.5 0zM12 2.25a.75.75 0 000 1.5 5.25 5.25 0 010 10.5.75.75 0 000 1.5 6.75 6.75 0 000-13.5z" />
                <path d="M5.25 9a.75.75 0 00-1.5 0v3c0 1.59.846 2.973 2.12 3.788a.75.75 0 10.8-1.25A3.003 3.003 0 015.25 12V9z" />
                <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V3.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM7.502 6.045a.75.75 0 011.04-.2A5.22 5.22 0 0112 4.5c1.234 0 2.37.427 3.268 1.15a.75.75 0 11-.94 1.154A3.72 3.72 0 0012 6c-1.04 0-1.99.425-2.67 1.116a.75.75 0 01-1.06.046.75.75 0 01-.03-1.06l.262-.257z" clipRule="evenodd" />
            </svg>
        ),
        items: [
            { label: 'Technical Playbook', href: '/agentic-ai-products/technical-strategies' },
            { label: 'Business Playbook', href: '/agentic-ai-products/product-business' },
            { label: 'Evals', href: '/agentic-ai-products/agentic-ai-evals' },
            { label: 'Agentic RL', href: '/agentic-ai-products/agentic-rl' },
            { label: 'Context Engineering', href: '/agentic-ai-products/context-engineering' },
            { label: 'Product Proposals', href: '/agentic-ai-products/product-proposals' }
        ]
    },
    {
        title: 'Production Playbooks',
        mainLink: '/playbooks',
        colorClass: 'bg-orange-100 text-orange-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.25 4.533A2.25 2.25 0 0112.75 3h6.75a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H12.75a2.25 2.25 0 01-1.5-.566V4.533zM4.53 4.533A2.25 2.25 0 003 6.75v13.5a2.25 2.25 0 002.25 2.25h6.75a2.25 2.25 0 001.5-.566V4.533a2.25 2.25 0 00-1.5-1.533H4.53z" />
            </svg>
        ),
        items: [
            { label: 'MLOps in Production', href: '/playbooks/mlops-production-guide' },
            { label: 'GenAI Applications', href: '/playbooks/genai-applications' },
            { label: 'AI Agents', href: '/playbooks/agents' },
            { label: 'Stats for MLOps', href: '/playbooks/stats-for-mlops' }
        ]
    },
    {
        title: 'Product Prototypes',
        mainLink: '/products',
        colorClass: 'bg-green-100 text-green-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M9.375 3a1.875 1.875 0 000 3.75h1.875v4.5H3.375A1.875 1.875 0 011.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0112 2.753a3.375 3.375 0 001.356 3.755h6.769A1.875 1.875 0 0122 8.383v.792A1.875 1.875 0 0120.125 11h-1.875v-4.5h1.125c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H13.125A3.375 3.375 0 019.375 3z" />
                <path d="M16.5 12.75H12V21h4.5v-8.25zm1.5 0v8.25h1.125a1.875 1.875 0 001.875-1.875V15a1.875 1.875 0 00-1.875-1.875H18zM10.5 12.75h-4.5V21h4.5v-8.25zm-6 0v8.25H2.625A1.875 1.875 0 01.75 19.125V15a1.875 1.875 0 011.875-1.875H4.5z" />
            </svg>
        ),
        items: [
            { label: 'Agentic MLOps', href: '/products/agentic-mlops' },
            { label: 'AI Scriptwriter', href: '/products/ai-scriptwriter' },
            { label: 'Feynman Style Kannada Physics Tutor', href: '/products/ai-feynman-kannada-tutor' },
            { label: 'Learn with AI', href: '/products/learn-with-ai' }
        ]
    },
    {
        title: 'Agentic Coding',
        mainLink: '/agentic-coding',
        colorClass: 'bg-indigo-100 text-indigo-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 01-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
        ),
        items: [
            { label: 'Spec Driven Dev', href: '/agentic-coding/spec-driven-development' },
            { label: 'Claude Code Howto', href: '/agentic-coding/claude-code-howto' },
            { label: 'Claude Agent SDK Howto', href: '/agentic-coding/claude-agent-sdk' },
            { label: 'How to build coding Agents', href: '/agentic-coding/how-to-build-coding-agents' }
        ]
    },
    {
        title: 'Illustrated Guides',
        mainLink: '/illustrated-guides',
        colorClass: 'bg-purple-100 text-purple-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h1.875c.621 0 1.125.504 1.125 1.125V19.5a.75.75 0 00.75.75h3.75a.75.75 0 00.75-.75V4.125c0-1.036.84-1.875 1.875-1.875H18a1.875 1.875 0 011.875 1.875v15.75c0 1.035-.84 1.875-1.875 1.875H4.125A1.875 1.875 0 012.25 19.875V4.125z" clipRule="evenodd" />
                <path d="M10.875 19.5h-4.5V11.25h4.5v8.25zm6-5.25h-4.5V19.5h4.5v-5.25z" />
            </svg>
        ),
        items: [
            { label: 'Stats for MLOps', href: '/illustrated-guides/stats-for-mlops' },
            { label: 'Illustrated RLHF', href: '/illustrated-guides/illustrated-rlhf' }
        ]
    },
    {
        title: 'Data Visualisation',
        mainLink: '/data-visualisation',
        colorClass: 'bg-pink-100 text-pink-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
            </svg>
        ),
        items: [
            { label: 'Rhythm Similarity', href: '/data-visualisation/music/code/index.html' },
            { label: 'Airbnb vs cities', href: '/data-visualisation/airbnb/code/index.html' },
            { label: 'Cricket Sabermetrics', href: '/data-visualisation/cricket_sabermetrics/code/index.html' },
            { label: 'Covid19 India Story', href: '/data-visualisation/covid19_india_story/code/index.html' }

        ]
    }
];

export default function HomeGridSections() {
    return (
        <section className="max-w-7xl mx-auto px-4 mt-8 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div
                        key={idx}
                        className="group relative flex flex-col p-6 bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl card-hover-effect"
                    >
                        <Link href={section.mainLink} className="flex items-center gap-3 mb-4 group/header">
                            <div className={`p-2 rounded-lg ${section.colorClass} bg-opacity-20 transition-transform group-hover/header:scale-110`}>
                                {section.icon}
                            </div>
                            <h3 className="grid-title text-lg font-bold transition-colors">
                                {section.title}
                            </h3>
                        </Link>

                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-1">
                            {section.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                    <Link
                                        href={item.href}
                                        className="grid-item-link flex items-start text-sm font-medium transition-colors"
                                    >
                                        <span className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-40 flex-shrink-0"></span>
                                        <span className="leading-tight">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
