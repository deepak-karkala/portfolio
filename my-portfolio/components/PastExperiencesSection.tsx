'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import ExperienceLogo from './ExperienceLogo';
import { pastExperiences } from '@/lib/pastExperiencesData';

const renderDetails = (details: string) => {
  const lines = details.split('\n');
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keySuffix: string) => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`list-${keySuffix}`} className="experience-detail-list">
          {listItems.map((item, index) => (
            <li key={`${keySuffix}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`${index}`);
      return;
    }

    const bulletMatch = trimmed.match(/^(•|-)\s+(.*)/);
    const numberMatch = trimmed.match(/^\d+\.\s+(.*)/);

    if (bulletMatch) {
      listItems.push(bulletMatch[2]);
      return;
    }

    if (numberMatch) {
      listItems.push(trimmed);
      return;
    }

    flushList(`${index}`);

    const isHeading = trimmed.endsWith(':') && trimmed.toUpperCase() === trimmed;
    if (isHeading) {
      blocks.push(
        <p key={`heading-${index}`} className="experience-detail-heading">
          {trimmed}
        </p>
      );
      return;
    }

    blocks.push(
      <p key={`paragraph-${index}`} className="experience-detail-paragraph">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList('final');
  return blocks;
};

type InlineOptions = {
  allowBold?: boolean;
  linkClassName?: string;
};

const renderInline = (text: string, options: InlineOptions = {}) => {
  const { allowBold = true, linkClassName = 'experience-link' } = options;
  const nodes: ReactNode[] = [];
  let buffer = '';

  const flushBuffer = (key: string) => {
    if (buffer) {
      nodes.push(<span key={key}>{buffer}</span>);
      buffer = '';
    }
  };

  let i = 0;
  while (i < text.length) {
    if (allowBold && text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        flushBuffer(`text-${i}`);
        nodes.push(
          <strong key={`bold-${i}`}>
            {renderInline(text.slice(i + 2, end), { allowBold: false, linkClassName })}
          </strong>
        );
        i = end + 2;
        continue;
      }
    }

    if (text[i] === '[') {
      const labelEnd = text.indexOf(']', i + 1);
      if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
        let urlEnd = labelEnd + 2;
        let depth = 1;
        while (urlEnd < text.length && depth > 0) {
          const char = text[urlEnd];
          if (char === '(') depth += 1;
          if (char === ')') depth -= 1;
          urlEnd += 1;
        }

        if (depth === 0) {
          const label = text.slice(i + 1, labelEnd);
          const href = text.slice(labelEnd + 2, urlEnd - 1);
          flushBuffer(`text-${i}`);
          nodes.push(
            <a
              key={`link-${i}`}
              href={href}
              className={linkClassName}
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          );
          i = urlEnd;
          continue;
        }
      }
    }

    buffer += text[i];
    i += 1;
  }

  flushBuffer(`text-${i}`);
  return nodes;
};

const renderSummary = (summary: string) => {
  const lines = summary.split('\n');
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keySuffix: string) => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`summary-list-${keySuffix}`} className="experience-summary-list">
          {listItems.map((item, index) => (
            <li key={`${keySuffix}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`${index}`);
      return;
    }

    const bulletMatch = trimmed.match(/^(•|-)\s+(.*)/);
    if (bulletMatch) {
      listItems.push(bulletMatch[2]);
      return;
    }

    flushList(`${index}`);
    blocks.push(
      <p key={`summary-paragraph-${index}`}>{renderInline(trimmed)}</p>
    );
  });

  flushList('final');
  return blocks;
};

export default function PastExperiencesSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set());
  const entries = useMemo(() => pastExperiences, []);

  return (
    <section className="past-experiences-wrapper mt-16">
      <div className="past-experiences">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
            Past Experiences
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-primary)' }}>
            Professional ML engineering experience across e-commerce and IoT domains
          </p>
        </div>

        <ul className="experience-timeline">
          {entries.map((entry) => {
            const isOpen = openItems.has(entry.id);
            const detailsId = `experience-details-${entry.id}`;

            return (
              <li key={entry.id} className={`experience-entry${isOpen ? ' is-open' : ''}`}>
                <div className="experience-marker">
                  {entry.logo ? (
                    <ExperienceLogo logo={entry.logo} alt={entry.organization} size="small" />
                  ) : (
                    <span className="experience-dot" aria-hidden="true" />
                  )}
                </div>

                <div className="experience-card">
                  <div className="experience-meta">
                    <span className="experience-dates">{entry.dateRange}</span>
                    {entry.location && <span className="experience-separator">•</span>}
                    {entry.location && <span>{entry.location}</span>}
                  </div>

                  <div className="experience-title-row">
                    <h3 className="experience-title">
                      <span className="experience-title-role">{entry.title}</span>
                      <span className="experience-at"> at </span>
                      <span className="experience-company">
                        {renderInline(entry.organization, {
                          linkClassName: 'experience-title-link',
                        })}
                      </span>
                    </h3>
                    <button
                      type="button"
                      className="experience-toggle"
                      aria-expanded={isOpen}
                      aria-controls={detailsId}
                      onClick={() => {
                        setOpenItems((prev) => {
                          const next = new Set(prev);
                          if (next.has(entry.id)) {
                            next.delete(entry.id);
                          } else {
                            next.add(entry.id);
                          }
                          return next;
                        });
                      }}
                    >
                      <span className="sr-only">Toggle details</span>
                      <svg
                        className="experience-toggle-icon"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {entry.summary && (
                    <div className="experience-summary">
                      {renderSummary(entry.summary)}
                    </div>
                  )}

                  <div
                    id={detailsId}
                    className="experience-details"
                    hidden={!isOpen}
                    aria-hidden={!isOpen}
                  >
                    {renderDetails(entry.details)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
