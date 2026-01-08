'use client';

import { useEffect, useState } from 'react';

interface Section {
    id: string;
    title: string;
}

interface ProductSidebarProps {
    sections: Section[];
}

export default function ProductSidebar({ sections }: ProductSidebarProps) {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0px -70% 0px',
            }
        );

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sections.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [sections]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Adjust based on your header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="hidden lg:block sticky top-24 h-fit">
            <nav className="space-y-1">
                <p className="text-sm font-semibold mb-3 text-muted-foreground">On this page</p>
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => handleClick(section.id)}
                        className={`w-full text-left text-sm py-1.5 px-3 rounded transition-colors cursor-pointer ${
                            activeSection === section.id
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                    >
                        {section.title}
                    </button>
                ))}
            </nav>
        </div>
    );
}
