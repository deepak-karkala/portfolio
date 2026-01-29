import Header, { NavGroup, NavLinkItem } from './Header';
import {
    getExperiences,
    getProducts,
    getPlaybooks,
    getDataVisualisations,
    getIllustratedGuides,
    getVentures,
} from '@/lib/content';

const MAX_DROPDOWN_ITEMS = 6;

const agenticAISections: NavLinkItem[] = [
    { label: 'Technical Strategies & Architecture', href: '/agentic-ai-products/technical-strategies' },
    { label: 'Product & Business Strategy', href: '/agentic-ai-products/product-business' },
    { label: 'Skills, MCP, Context & Subagents', href: '/agentic-ai-products/skills-mcp-subagents' },
    { label: 'Flagship Product Proposals', href: '/agentic-ai-products/product-proposals' },
    { label: 'Context Engineering', href: '/agentic-ai-products/context-engineering' },
    { label: 'Claude Agent SDK', href: '/agentic-ai-products/claude-agent-sdk' },
    { label: 'Agentic RL & RFT', href: '/agentic-ai-products/agentic-rl' },
    { label: 'Evaluation of AI Agents', href: '/agentic-ai-products/agentic-ai-evals' },
];

const agenticCodingSections: NavLinkItem[] = [
    { label: 'Claude Agent SDK', href: '/agentic-coding/claude-agent-sdk' },
    { label: 'Configuration & Setup', href: '/agentic-coding/claude-code-config' },
    { label: 'How-To Guides', href: '/agentic-coding/claude-code-howto' },
    { label: 'Build Coding Agents', href: '/agentic-coding/how-to-build-coding-agents' },
    { label: 'Spec-Driven Development', href: '/agentic-coding/spec-driven-development' },
];

function limitItems(items: NavLinkItem[], limit: number) {
    return items.slice(0, limit);
}

function mapContentItems(items: { slug: string; title: string }[], basePath: string) {
    return items.map((item) => ({
        label: item.title,
        href: `${basePath}/${item.slug}`,
    }));
}

export default async function HeaderServer() {
    const [
        experiences,
        products,
        playbooks,
        dataVisualisations,
        illustratedGuides,
        ventures,
    ] = await Promise.all([
        getExperiences(),
        getProducts(),
        getPlaybooks(),
        getDataVisualisations(),
        getIllustratedGuides(),
        getVentures(),
    ]);

    const dataVizItems: NavLinkItem[] = dataVisualisations.map((item) => ({
        label: item.title,
        href: item.vizUrl || '/data-visualisation',
        external: Boolean(item.vizUrl),
    }));

    const navGroups: NavGroup[] = [
        {
            label: 'Agentic AI Products',
            href: '/agentic-ai-products',
            items: limitItems(agenticAISections, MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
        },
        {
            label: 'Agentic Coding',
            href: '/agentic-coding',
            items: agenticCodingSections,
            viewAllLabel: 'View all',
        },
        {
            label: 'Past Experiences',
            href: '/experiences',
            items: limitItems(mapContentItems(experiences, '/experiences'), MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
        },
        {
            label: 'Projects',
            href: '/products',
            items: limitItems(mapContentItems(products, '/products'), MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
        },
        {
            label: 'Playbooks',
            href: '/playbooks',
            items: limitItems(mapContentItems(playbooks, '/playbooks'), MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
        },
        {
            label: 'Data Viz',
            href: '/data-visualisation',
            items: limitItems(dataVizItems, MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
        },
        {
            label: 'Illustrated Guides',
            href: '/illustrated-guides',
            items: limitItems(mapContentItems(illustratedGuides, '/illustrated-guides'), MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
        },
        {
            label: 'Ventures',
            href: '/ventures',
            items: limitItems(mapContentItems(ventures, '/ventures'), MAX_DROPDOWN_ITEMS),
            viewAllLabel: 'View all',
            align: 'right',
        },
    ];

    return <Header navGroups={navGroups} />;
}
