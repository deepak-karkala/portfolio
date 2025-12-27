'use client';

import { useEffect, useState } from 'react';

interface SubSection {
    id: string;
    title: string;
}

interface Section {
    id: string;
    title: string;
    subSections?: SubSection[];
}

interface AgenticAISidebarProps {
    sections: Section[];
}

export default function AgenticAISidebar({ sections }: AgenticAISidebarProps) {
    const [activeSection, setActiveSection] = useState<string>('');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['product-proposals']));

    useEffect(() => {
        const allSectionIds = sections.flatMap(section =>
            section.subSections
                ? [section.id, ...section.subSections.map(sub => sub.id)]
                : [section.id]
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        // Auto-expand parent section when a subsection becomes active
                        const parentSection = sections.find(s =>
                            s.subSections?.some(sub => sub.id === entry.target.id)
                        );
                        if (parentSection) {
                            setExpandedSections(prev => new Set([...prev, parentSection.id]));
                        }
                    }
                });
            },
            {
                rootMargin: '-20% 0px -70% 0px',
            }
        );

        allSectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            allSectionIds.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [sections]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const isActive = (id: string) => activeSection === id;
    const isSubSectionActive = (section: Section) =>
        section.subSections?.some(sub => sub.id === activeSection);

    return (
        <div className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
            <nav className="space-y-1">
                <p className="text-sm font-semibold mb-3 text-muted-foreground">On this page</p>
                {sections.map((section) => (
                    <div key={section.id}>
                        {section.subSections ? (
                            <>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={`flex items-center justify-between w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                                        isActive(section.id) || isSubSectionActive(section)
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClick(section.id);
                                        }}
                                    >
                                        {section.title}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            expandedSections.has(section.id) ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedSections.has(section.id) && (
                                    <div className="ml-3 mt-1 space-y-1 border-l-2 border-muted pl-2">
                                        {section.subSections.map((subSection) => (
                                            <button
                                                key={subSection.id}
                                                onClick={() => handleClick(subSection.id)}
                                                className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                                                    isActive(subSection.id)
                                                        ? 'bg-primary/10 text-primary font-medium'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                                }`}
                                            >
                                                {subSection.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <button
                                onClick={() => handleClick(section.id)}
                                className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                                    isActive(section.id)
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                                {section.title}
                            </button>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}
