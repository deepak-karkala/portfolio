import { ContentItem } from './content';
import React from 'react';

export interface GroupedExperience {
  category: string;
  categoryDuration: string | undefined;
  categoryLogo: string | undefined;
  items: ContentItem[];
}

// Helper to get logo from first item in category (for work experiences)
export function getCategoryLogo(category: string, items: ContentItem[]): string | undefined {
  if (category !== 'Education' && category !== 'Other') {
    return items[0]?.logo;
  }
  return undefined;
}

// Helper to extract company name from category string
export function extractCompanyName(category: string): string {
  if (category.includes(' at ')) {
    return category.split(' at ')[1];
  }
  if (category.includes('mid sized European ')) {
    return category.split('mid sized European ')[1];
  }
  return category;
}

// Helper to render category title with styled company name
export function renderCategoryTitle(category: string): React.ReactNode {
  if (category.includes('E-commerce marketplace')) {
    const parts = category.split('mid sized European ');
    return React.createElement(
      React.Fragment,
      null,
      parts[0],
      'mid sized European ',
      React.createElement(
        'span',
        { className: 'font-bold', style: { color: 'var(--color-accent)' } },
        parts[1]
      )
    );
  }

  if (category.includes(' at ')) {
    const parts = category.split(' at ');
    return React.createElement(
      React.Fragment,
      null,
      parts[0],
      ' at ',
      React.createElement(
        'span',
        { className: 'font-bold', style: { color: 'var(--color-accent)' } },
        parts[1]
      )
    );
  }

  return category;
}

// Group experiences by category with custom sort order
export function groupExperiences(experiences: ContentItem[]): GroupedExperience[] {
  const groups = new Map<string, ContentItem[]>();

  experiences.forEach((exp) => {
    const key = exp.category || 'Other';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(exp);
  });

  const order = [
    'Senior ML Engineer (Contract) at Mid-sized European E-commerce Marketplace (Client - NDA)',
    'ML Engineer at eSMART Technologies',
    'Machine Learning Research Intern at NEC Labs America',
    'Education',
    'Other',
  ];

  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    })
    .map(([category, items]) => ({
      category,
      categoryDuration: items[0]?.categoryDuration,
      categoryLogo: getCategoryLogo(category, items),
      items: [...items].sort((a, b) => (a.date > b.date ? -1 : 1)),
    }));
}

// Homepage-specific version that filters out Education
export function groupExperiencesForHomepage(experiences: ContentItem[]): GroupedExperience[] {
  return groupExperiences(experiences).filter(
    ({ category }) => category !== 'Education'
  );
}
