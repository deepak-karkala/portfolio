'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { journeyItems, JourneyItem } from '@/lib/journeyData';

interface JourneyCardProps {
  item: JourneyItem;
  position: string;
  onClick: () => void;
}

function JourneyCard({ item, position, onClick }: JourneyCardProps) {
  return (
    <div
      className={`coverflow-card ${position} journey-card category-${item.category}`}
      onClick={onClick}
      role="button"
      tabIndex={position === 'active' ? 0 : -1}
      aria-label={`${item.company} - ${item.role}`}
    >
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md">
          <Image
            src={item.logo}
            alt={`${item.company} logo`}
            width={80}
            height={80}
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Company Name */}
      <h3 className="text-xl font-bold text-center mb-1" style={{ color: 'var(--color-foreground)' }}>
        {item.company}
      </h3>

      {/* Role */}
      <p className="text-sm font-medium text-center mb-2" style={{ color: 'var(--color-accent)' }}>
        {item.role}
      </p>

      {/* Duration & Location */}
      <div className="text-xs text-center mb-3" style={{ color: 'var(--color-primary)' }}>
        <p>{item.duration}</p>
        <p>{item.location}</p>
      </div>

      {/* Highlight */}
      <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--color-foreground)', opacity: 0.8 }}>
        {item.highlight}
      </p>

      {/* Category Badge */}
      <div className="mt-4 flex justify-center">
        <span
          className="text-xs px-3 py-1 rounded-full capitalize font-medium"
          style={{
            backgroundColor: getCategoryColor(item.category),
            color: 'white'
          }}
        >
          {item.category}
        </span>
      </div>

      {/* View Details Link (only visible on active card) */}
      {position === 'active' && (
        <Link
          href={`/experiences/${item.slug}`}
          className="mt-4 block text-center text-sm font-medium"
          style={{ color: 'var(--color-accent)' }}
        >
          View Details →
        </Link>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'education':
      return '#3B82F6';
    case 'work':
      return '#10B981';
    case 'research':
      return '#8B5CF6';
    case 'venture':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
}

function getCardPosition(index: number, activeIndex: number, totalItems: number): string {
  const diff = index - activeIndex;

  if (diff === 0) return 'active';
  if (diff === -1 || (diff === totalItems - 1 && activeIndex === 0)) return 'prev-1';
  if (diff === -2 || (diff === totalItems - 2 && activeIndex === 0)) return 'prev-2';
  if (diff === 1 || (diff === -(totalItems - 1) && activeIndex === totalItems - 1)) return 'next-1';
  if (diff === 2 || (diff === -(totalItems - 2) && activeIndex === totalItems - 1)) return 'next-2';
  if (diff < -2 || diff === totalItems - 3) return 'prev-3';
  if (diff > 2 || diff === -(totalItems - 3)) return 'next-3';

  return 'hidden';
}

export default function CoverFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = journeyItems.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  }, [totalItems]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div className="w-full">
      {/* Cover Flow Container */}
      <div className="coverflow-container">
        <div className="coverflow-items">
          {journeyItems.map((item, index) => (
            <JourneyCard
              key={item.id}
              item={item}
              position={getCardPosition(index, activeIndex, totalItems)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="coverflow-nav">
        <button
          onClick={handlePrev}
          disabled={false}
          aria-label="Previous"
        >
          ←
        </button>

        {/* Progress Dots */}
        <div className="coverflow-dots">
          {journeyItems.map((_, index) => (
            <button
              key={index}
              className={`coverflow-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={false}
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Active Item Info */}
      <div className="text-center mt-4">
        <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
          {activeIndex + 1} / {totalItems}
        </p>
      </div>
    </div>
  );
}
