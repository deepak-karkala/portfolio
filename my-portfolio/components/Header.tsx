import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const navItems = [
    { name: 'Agentic AI Products', href: '/agentic-ai-products' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Products', href: '/products' },
    { name: 'Playbooks', href: '/playbooks' },
    { name: 'Illustrated Guides', href: '/illustrated-guides' },
    { name: 'About', href: '/about' },
];

export default function Header() {
    return (
        <header className="p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="font-bold text-xl" style={{color: 'var(--color-foreground)'}}>Your Name</Link>
                <ul className="flex space-x-6">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link 
                                href={item.href} 
                                className="transition-colors hover:opacity-80"
                                style={{color: 'var(--color-primary)'}}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/contact" className="btn-primary">
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
} 