'use client';

interface TabItem {
    id: string;
    title: string;
}

interface TabsNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export default function TabsNavigation({ tabs, activeTab, onTabChange, className = '' }: TabsNavigationProps) {
    return (
        <div className={`border-b-2 border-primary/20 ${className}`}>
            <div className="flex gap-1 overflow-x-auto" role="tablist">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            role="tab"
                            aria-selected={isActive}
                            className={`
                                relative px-6 py-3 text-sm font-semibold rounded-t-lg transition-all whitespace-nowrap
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background
                                ${isActive
                                    ? 'text-foreground bg-background border-2 border-b-0 border-primary/40 shadow-md after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                                    : 'text-foreground/60 border border-transparent hover:text-foreground hover:bg-background/50 hover:border-primary/20 hover:shadow-sm'
                                }
                            `}
                        >
                            {tab.title}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
