'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export type NavLinkItem = {
    label: string;
    href: string;
    external?: boolean;
};

export type NavGroup = {
    label: string;
    href: string;
    items?: NavLinkItem[];
    viewAllLabel?: string;
    align?: 'left' | 'right';
};

type HeaderProps = {
    navGroups: NavGroup[];
};

export default function Header({ navGroups }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="p-4">
            <nav className="mx-auto w-full max-w-7xl px-6">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="font-bold text-xl"
                        style={{ color: 'var(--color-foreground)' }}
                    >
                        About Me
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex space-x-6 text-[0.9rem]">
                            {navGroups.map((group) => (
                                <li key={group.label} className="relative group">
                                    <Link
                                        href={group.href}
                                        className="transition-colors hover:opacity-80 whitespace-nowrap inline-flex items-center gap-1"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        {group.label}
                                    </Link>

                                    {group.items && group.items.length > 0 && (
                                        <div
                                            className={`absolute top-full z-50 pt-3 opacity-0 pointer-events-none translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 ${group.align === 'right' ? 'right-0' : 'left-0'}`}
                                        >
                                            <div
                                                className="w-[18rem] max-w-[18rem] rounded-2xl border shadow-2xl p-3"
                                                style={{
                                                    backgroundColor: 'var(--color-background)',
                                                    backgroundImage:
                                                        'linear-gradient(180deg, color-mix(in srgb, var(--color-background) 92%, var(--color-secondary) 8%), var(--color-background))',
                                                    borderColor: 'color-mix(in srgb, var(--color-card-border) 70%, transparent)',
                                                }}
                                            >
                                                <ul className="space-y-1">
                                                    {group.items.map((item) => (
                                                        <li key={item.href}>
                                                            {item.external ? (
                                                                <a
                                                                    href={item.href}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:opacity-80"
                                                                    style={{ color: 'var(--color-primary)' }}
                                                                >
                                                                    {item.label}
                                                                </a>
                                                            ) : (
                                                                <Link
                                                                    href={item.href}
                                                                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:opacity-80"
                                                                    style={{ color: 'var(--color-primary)' }}
                                                                >
                                                                    {item.label}
                                                                </Link>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {group.viewAllLabel && (
                                                    <div className="mt-2 border-t pt-2" style={{ borderColor: 'var(--color-card-border)' }}>
                                                        <Link
                                                            href={group.href}
                                                            className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:opacity-80"
                                                            style={{ color: 'var(--color-accent)' }}
                                                        >
                                                            {group.viewAllLabel}
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link href="/contact" className="btn-primary btn-compact">
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:hidden">
                        <ThemeToggle />
                        <button
                            type="button"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-primary)' }}
                        >
                            <span className="sr-only">Toggle menu</span>
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path
                                    d="M4 7h16M4 12h16M4 17h16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`md:hidden ${isMenuOpen ? 'mt-4' : 'hidden'}`}>
                    <ul className="space-y-3 text-sm">
                        {navGroups.map((group) => (
                            <li key={group.label}>
                                <Link
                                    href={group.href}
                                    className="block rounded-lg px-3 py-2 transition-colors hover:opacity-80 font-medium"
                                    style={{ color: 'var(--color-primary)' }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {group.label}
                                </Link>
                                {group.items && group.items.length > 0 && (
                                    <ul
                                        className="mt-1 space-y-1 border-l pl-3"
                                        style={{ borderColor: 'var(--color-card-border)' }}
                                    >
                                        {group.items.map((item) => (
                                            <li key={item.href}>
                                                {item.external ? (
                                                    <a
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block rounded-md px-2 py-1 text-xs transition-colors hover:opacity-80"
                                                        style={{ color: 'var(--color-primary)' }}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {item.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={item.href}
                                                        className="block rounded-md px-2 py-1 text-xs transition-colors hover:opacity-80"
                                                        style={{ color: 'var(--color-primary)' }}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                        {group.viewAllLabel && (
                                            <li>
                                                <Link
                                                    href={group.href}
                                                    className="block rounded-md px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide transition-colors hover:opacity-80"
                                                    style={{ color: 'var(--color-accent)' }}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {group.viewAllLabel}
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3">
                        <Link
                            href="/contact"
                            className="btn-primary btn-compact inline-flex"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
} 
