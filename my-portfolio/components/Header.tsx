import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const navItems = [
    { name: 'Agentic AI Products', href: '/agentic-ai-products' },
    { name: 'Agentic Coding', href: '/agentic-coding' },
    { name: 'Past Experiences', href: '/experiences' },
    { name: 'Projects', href: '/products' },
    { name: 'Playbooks', href: '/playbooks' },
    { name: 'Data Viz', href: '/data-visualisation' },
    { name: 'Illustrated Guides', href: '/illustrated-guides' },
    { name: 'Ventures', href: '/ventures' },
];

export default function Header() {
    return (
        <header className="p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="font-bold text-xl" style={{color: 'var(--color-foreground)'}}>About Me</Link>
                <ul className="flex space-x-6 text-[0.9rem]">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="transition-colors hover:opacity-80 whitespace-nowrap"
                                style={{color: 'var(--color-primary)'}}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/contact" className="btn-primary btn-compact">
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
} 
