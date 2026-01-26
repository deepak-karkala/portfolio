import Link from 'next/link';
import { notFound } from 'next/navigation';
import AgenticCodingNavSidebar from '@/components/AgenticCodingNavSidebar';
import { getContentBySlug } from '@/lib/content';

export async function generateMetadata() {
    const content = await getContentBySlug('agentic-coding', 'claude_code_howto/claude_code_features');

    return {
        title: content?.title || 'Claude Code Features',
        description: content?.summary || 'Feature documentation and capabilities overview',
    };
}

export default async function ClaudeCodeFeaturesPage() {
    const content = await getContentBySlug('agentic-coding', 'claude_code_howto/claude_code_features');

    if (!content) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/agentic-coding/claude-code-howto"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to How-To Guides
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <AgenticCodingNavSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl product-body">
                        <header className="mb-12">
                            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
                            <p className="text-xl text-muted-foreground">{content.summary}</p>
                        </header>

                        <article
                            className="markdown-body"
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
