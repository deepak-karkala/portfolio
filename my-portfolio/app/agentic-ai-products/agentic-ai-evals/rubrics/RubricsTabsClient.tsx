'use client';

import { useState } from 'react';
import TabsNavigation from '@/components/TabsNavigation';

interface Rubric {
    id: string;
    title: string;
    description: string;
    content: string;
}

interface RubricsTabsClientProps {
    rubrics: Rubric[];
}

export default function RubricsTabsClient({ rubrics }: RubricsTabsClientProps) {
    const [activeTab, setActiveTab] = useState(rubrics[0]?.id || 'trajectory');

    const activeRubric = rubrics.find(r => r.id === activeTab);

    return (
        <>
            {/* Tab Navigation */}
            <div className="mb-8">
                <TabsNavigation
                    tabs={rubrics.map(r => ({ id: r.id, title: r.title }))}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="mb-8"
                />

                {/* Tab Description */}
                {activeRubric && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                        <p className="text-sm">
                            <span className="font-bold text-primary">📍 Currently viewing:</span> <span className="text-foreground">{activeRubric.description}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Tab Content */}
            <div className="product-body">
                {activeRubric && (
                    <article
                        className="markdown-body"
                        dangerouslySetInnerHTML={{ __html: activeRubric.content }}
                    />
                )}
            </div>
        </>
    );
}
