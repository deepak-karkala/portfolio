'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
}

export default function VentureNav() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // Dynamically find all h2 headings in the markdown content
    const articleElement = document.querySelector('.markdown-body');
    if (!articleElement) return;

    const headings = articleElement.querySelectorAll('h2');
    const discoveredSections: Section[] = [];

    headings.forEach((heading) => {
      if (heading.id && heading.textContent) {
        discoveredSections.push({
          id: heading.id,
          label: heading.textContent,
        });
      }
    });

    setSections(discoveredSections);

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24">
      <h3
        className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground"
      >
        Contents
      </h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={`block text-sm py-1 transition-all border-l-2 pl-4 ${
                activeSection === section.id
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
