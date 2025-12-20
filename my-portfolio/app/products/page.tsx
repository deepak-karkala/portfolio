import Link from 'next/link';
import { getProducts } from '@/lib/content';

export const metadata = {
    title: 'Products | My Portfolio',
    description: 'A collection of my products and projects.',
};

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Products</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        A showcase of products, tools, and experiments I&apos;ve built.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => {
                        // Special handling for nested products to match custom routes
                        const href = product.slug === 'ai-scriptwriter/sitcom-office'
                            ? '/products/ai-scriptwriter'
                            : product.slug === 'ai-feynman-kannada-tutor/kannada-physics-tutor'
                            ? '/products/ai-feynman-kannada-tutor'
                            : `/products/${product.slug}`;

                        return (
                            <Link
                                key={product.slug}
                                href={href}
                                className="group block h-full"
                            >
                                <article className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                                    {product.image && (
                                        <div className="aspect-video w-full overflow-hidden bg-muted">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {product.title}
                                        </h2>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                            {product.summary}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {product.techStack?.slice(0, 3).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {product.techStack && product.techStack.length > 3 && (
                                                <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200">
                                                    +{product.techStack.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
